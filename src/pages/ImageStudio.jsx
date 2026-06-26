import { useState, useCallback, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startAsyncImageGeneration, createGenerationPoller } from '@/services/generationPollingService';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Download, RefreshCw, Camera } from 'lucide-react';
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
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingStatus, setPollingStatus] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Simulated live-progress counter parameters
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
      const response = await startAsyncImageGeneration({
        topic: params.prompt,
        style: params.style,
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
                platform: "AI Image",
                variants: [{
                  content: prompt,
                  image_url: imageUrl,
                  title: "AI Image"
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
    });
  }, [prompt, style, generateMutation]);

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
      link.download = `creativeos-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Blob download failed, falling back to direct tab link:', error);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Camera className="w-8 h-8 text-primary" />
            Image Studio
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate stunning AI-powered images with custom studio styles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Image Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[140px]"
                  disabled={generateMutation.isPending || isPolling}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle} disabled={generateMutation.isPending || isPolling}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
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
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>

              {pollingStatus === 'failed' && (
                <p className="text-sm text-center text-red-500 font-medium">Generation failed. Please try a different prompt structure.</p>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Progress Block or Generated Asset Rendering */}
          <Card>
            <CardHeader>
              <CardTitle>Studio Output</CardTitle>
            </CardHeader>
            <CardContent>
              {isPolling || generateMutation.isPending ? (
                /* Dynamic Progress Component Layout cloned verbatim from Generation Layout in image_c860a5.png */
                <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-center min-h-[400px] gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary mt-0.5">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Generating image
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {pollingStatus === 'queued' 
                            ? 'Queued in system. Preparing image engine context...' 
                            : 'Midjourney/Dall-E is rendering high-resolution asset matrices.'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold tracking-tight text-foreground">
                        {displayProgressValue}%
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        Estimated progress
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={displayProgressValue} className="h-2.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Elapsed: {formatRemainingTime(stageElapsedMs)}</span>
                      <span>
                        {displayRemainingMs > 0 
                          ? `About ${formatRemainingTime(displayRemainingMs)} remaining` 
                          : 'Finalizing layout view...'}
                      </span>
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
                  <div className="relative rounded-lg overflow-hidden border">
                    <img
                      src={generatedImage}
                      alt="Generated asset outcome"
                      className="w-full h-auto object-contain mx-auto"
                      style={{ minHeight: '300px', maxHeight: '500px' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="flex-1">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
                  <div className="text-center space-y-2">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground px-4">
                      Enter a creative prompt brief and click generate to begin.
                    </p>
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
        description="High-resolution workspace creation and stylistic painting cycles may take up to 2-3 minutes. Please stay on this tab until assets finalize."
        confirmLabel="Continue Generation"
      />
    </div>
  );
}