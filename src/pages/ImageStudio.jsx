import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startAsyncImageGeneration, createGenerationPoller } from '@/services/generationPollingService';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Download, RefreshCw, Camera, Layers, Sliders, Maximize } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { addHistoryEntry } from '@/services/aiService';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

const IMAGE_STYLES = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'anime', label: 'Anime' },
  { value: 'abstract', label: 'Abstract' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'watercolor', label: 'Watercolor' },
  { value: 'oil-painting', label: 'Oil Painting' },
];

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 Square (Instagram, Ads)' },
  { value: '16:9', label: '16:9 Landscape (YouTube, Website)' },
  { value: '9:16', label: '9:16 Portrait (Reels, Shorts)' },
  { value: '4:5', label: '4:5 Vertical (Social Feeds)' },
];

const ESTIMATED_TOTAL_MS = 180000; // 3 minutes total runtime estimate

const formatRemainingTime = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
};

export default function ImageStudio() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1'); // 🚀 Added aspect ratio state
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingStatus, setPollingStatus] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [stageStartedAt, setStageStartedAt] = useState(null);
  const [stageElapsedMs, setStageElapsedMs] = useState(0);

  useEffect(() => {
    if (!isPolling || !stageStartedAt) {
      setStageElapsedMs(0);
      return undefined;
    }

    const updateElapsed = () => {
      setStageElapsedMs(Date.now() - stageStartedAt);
    };

    updateElapsed();
    const intervalId = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(intervalId);
  }, [isPolling, stageStartedAt]);

  const displayProgressValue = isPolling
    ? Math.min(96, Math.max(8, Math.round((stageElapsedMs / ESTIMATED_TOTAL_MS) * 100)))
    : 0;

  const displayRemainingMs = Math.max(0, ESTIMATED_TOTAL_MS - stageElapsedMs);

  const generateMutation = useMutation({
    mutationFn: async (params) => {
      setPollingStatus('preparing');
      
      // 🛠️ FIX: Enrich the prompt brief explicitly with the style description so the AI model applies it
      const explicitStylePrompt = `${params.prompt}, in a distinct ${params.style} style, aspect ratio ${params.aspectRatio}`;
      
      const response = await startAsyncImageGeneration({
        topic: explicitStylePrompt,
        style: params.style,
        aspectRatio: params.aspectRatio, // 🚀 Passed to endpoint payload
      });
      return response;
    },
    onSuccess: (response) => {
      const jobId = response.jobId || response.id || response.job_id;
      
      if (!jobId) {
        setPollingStatus('failed');
        setIsPolling(false);
        return;
      }
      
      setIsPolling(true);
      setStageStartedAt(Date.now());
      setPollingStatus('queued');
      
      createGenerationPoller(
        jobId,
        'image',
        (status) => {
          const statusCode = status.status || pollingStatus;
          setPollingStatus(statusCode);
          
          if (statusCode === 'completed' && status.result) {
            const imageUrl = status.result.image_url || status.result.imageUrl;
            if (imageUrl) {
              const imageEntry = {
                topic: prompt,
                content_type: "Image",
                platform: "Studio Asset",
                variants: [{
                  content: prompt,
                  image_url: imageUrl,
                  title: `${style.toUpperCase()} Studio Image`
                }],
                status: "completed"
              };
              addHistoryEntry(imageEntry).catch(err => console.error("Failed to save image to history:", err));
              setGeneratedImage(imageUrl);
            }
          }
        },
        (finalStatus) => {
          setIsPolling(false);
          setStageStartedAt(null);
          const statusCode = finalStatus.status;
          
          if (statusCode === 'completed' && finalStatus.result) {
            const imageUrl = finalStatus.result.image_url || finalStatus.result.imageUrl;
            if (imageUrl) {
              setGeneratedImage(imageUrl);
              setPollingStatus('completed');
            }
          } else {
            setPollingStatus('failed');
          }
        },
        3000
      );
    },
    onError: (error) => {
      setIsPolling(false);
      setStageStartedAt(null);
      setPollingStatus('failed');
      console.error('Image generation failed:', error);
    },
  });

  const submitGeneration = useCallback(() => {
    generateMutation.mutate({
      prompt: prompt.trim(),
      style: style,
      aspectRatio: aspectRatio,
    });
  }, [prompt, style, aspectRatio, generateMutation]);

  const handleGenerateClick = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `creativeos-studio-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.target = '_blank';
      link.setAttribute('download', `generated-image-${Date.now()}.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt('');
    setPollingStatus(null);
    setStageStartedAt(null);
  };

  // Dynamic aspect ratio rendering style map
  const getAspectRatioClass = () => {
    if (aspectRatio === '16:9') return 'aspect-video';
    if (aspectRatio === '9:16') return 'aspect-[9/16] max-w-[280px]';
    if (aspectRatio === '4:5') return 'aspect-[4/5] max-w-[340px]';
    return 'aspect-square';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Block */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Camera className="w-8 h-8 text-primary" />
            Image Studio Pro
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced creative workspace for generating production-ready multi-platform visual assets.
          </p>
        </div>

        {/* 💡 Feature Differentiation Explainer Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-muted/30 border border-border/70 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Advanced Consistency</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Enforces precise, high-fidelity aesthetic parameters based on your core studio profile selections.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Maximize className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Custom Aspect Ratios</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Format assets directly for specialized ad channels, banners, or vertical mobile screen media feeds.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Standalone Asset Hub</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Independent generation workflows optimized for marketing graphics, entirely separate from post context blocks.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Studio Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Brief</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the high-resolution asset you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[140px]"
                  disabled={generateMutation.isPending || isPolling}
                />
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={generateMutation.isPending || isPolling}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select canvas sizing" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPECT_RATIOS.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        {ratio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Artistic Style</Label>
                <Select value={style} onValueChange={setStyle} disabled={generateMutation.isPending || isPolling}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_STYLES.map((styleOption) => (
                      <SelectItem key={styleOption.value} value={styleOption.value}>
                        {styleOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateClick}
                disabled={generateMutation.isPending || isPolling || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {generateMutation.isPending || isPolling ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rendering Canvas...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Render Studio Asset</>
                )}
              </Button>

              {pollingStatus === 'failed' && (
                <p className="text-sm text-center text-red-500 font-medium">Generation failed. Please check credit quotas or prompt complexity.</p>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Studio Output */}
          <Card>
            <CardHeader>
              <CardTitle>Studio Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              {isPolling || generateMutation.isPending ? (
                <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-center min-h-[400px] gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary mt-0.5">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Generating studio asset</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {pollingStatus === 'queued' 
                            ? 'Allocating compute nodes. Initializing layout engine models...' 
                            : 'Baking artistic textures and resolving contrast maps.'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold tracking-tight text-foreground">{displayProgressValue}%</p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Estimated progress</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={displayProgressValue} className="h-2.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Elapsed: {formatRemainingTime(stageElapsedMs)}</span>
                      <span>{displayRemainingMs > 0 ? `About ${formatRemainingTime(displayRemainingMs)} remaining` : 'Finalizing resolution matrix...'}</span>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 grid-cols-3 mt-2">
                    <div className={`rounded-xl border px-3 py-3 ${pollingStatus === 'preparing' ? 'border-primary/50 bg-primary/5' : 'border-border/70 bg-background/60'}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 1</p>
                      <p className="mt-1 text-xs font-medium text-foreground">Init Engine</p>
                    </div>
                    <div className={`rounded-xl border px-3 py-3 ${pollingStatus === 'queued' || pollingStatus === 'processing' ? 'border-primary/50 bg-primary/5' : 'border-border/70 bg-background/60'}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 2</p>
                      <p className="mt-1 text-xs font-medium text-foreground">Render Media</p>
                    </div>
                    <div className={`rounded-xl border px-3 py-3 ${displayProgressValue >= 92 ? 'border-primary/50 bg-primary/5' : 'border-border/70 bg-background/60'}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 3</p>
                      <p className="mt-1 text-xs font-medium text-foreground">Finalize</p>
                    </div>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border bg-black/5 flex items-center justify-center p-2">
                    <img
                      src={generatedImage}
                      alt="Generated asset outcome"
                      className={`w-full h-auto object-contain mx-auto rounded shadow-sm ${getAspectRatioClass()}`}
                      style={{ minHeight: '300px', maxHeight: '500px' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1"><Download className="w-4 h-4 mr-2" /> Download</Button>
                    <Button onClick={handleReset} variant="outline" className="flex-1"><RefreshCw className="w-4 h-4 mr-2" /> New Image</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
                  <div className="text-center space-y-2">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground px-4">Enter parameters and render to preview your studio canvas.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          setShowConfirmDialog(false);
          submitGeneration();
        }}
        title="Confirm image generation"
        description="High-resolution artistic creation and canvas mapping sequences can consume up to 2 minutes. Please keep this dashboard active until compilation finishes."
        confirmLabel="Continue Generation"
      />
    </div>
  );
}