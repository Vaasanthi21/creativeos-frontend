import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startAsyncImageGeneration, createGenerationPoller } from '@/services/generationPollingService';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Download, RefreshCw, Camera, Layers, Sliders, Flame, Wand2, Maximize2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { addHistoryEntry } from '@/services/aiService';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

const IMAGE_STYLES = [
  { value: 'realistic', label: 'Realistic Cinematic' },
  { value: 'illustration', label: 'Vector Illustration' },
  { value: 'anime', label: 'Anime / Manga' },
  { value: 'abstract', label: 'Abstract Concept Art' },
  { value: 'minimalist', label: 'Clean Minimalist' },
  { value: 'cyberpunk', label: 'Cyberpunk Neon' },
  { value: 'watercolor', label: 'Watercolor Wash' },
  { value: 'oil-painting', label: 'Oil Painting Textured' },
];

const LIGHTING_MODES = [
  { value: 'natural', label: 'Natural Soft Light' },
  { value: 'cinematic', label: 'Cinematic Volumetric' },
  { value: 'neon', label: 'Cyberpunk Neon Cyber Glow' },
  { value: 'studio', label: 'Studio Three-Point Lighting' },
  { value: 'dramatic', label: 'Dramatic Chiaroscuro' },
];

const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square (1:1) - Post' },
  { value: '16:9', label: 'Landscape (16:9) - Desktop' },
  { value: '9:16', label: 'Portrait (9:16) - Mobile/Stories' },
];

const IMAGE_STAGE_ESTIMATES_MS = 180000;

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
  const [lighting, setLighting] = useState('cinematic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
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
    const updateElapsed = () => setStageElapsedMs(Date.now() - stageStartedAt);
    updateElapsed();
    const intervalId = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(intervalId);
  }, [isPolling, stageStartedAt]);

  const displayProgressValue = isPolling
    ? Math.min(96, Math.max(8, Math.round((stageElapsedMs / IMAGE_STAGE_ESTIMATES_MS) * 100)))
    : 0;

  const displayRemainingMs = Math.max(0, IMAGE_STAGE_ESTIMATES_MS - stageElapsedMs);

  const generateMutation = useMutation({
    mutationFn: async (params) => {
      setPollingStatus('preparing');
      const finalBuiltPrompt = `${params.prompt}, ${params.style} style, ${params.lighting} lighting, ultra-detailed masterwork`;
      
      const response = await startAsyncImageGeneration({
        topic: finalBuiltPrompt,
        style: params.style,
        aspectRatio: params.aspectRatio,      // Main parameter format requested by Neeta
        aspect_ratio: params.aspectRatio,     // Secondary snake_case fallback configuration
      });
      return response;
    },
    onSuccess: (response) => {
      const jobId = response?.jobId || response?.id || response?.job_id;
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
          if (!status) return;
          const statusCode = status?.status || pollingStatus;
          setPollingStatus(statusCode);
          
          if (statusCode === 'completed' && status?.result) {
            const imageUrl = status?.result?.image_url || status?.result?.imageUrl;
            if (imageUrl) {
              const imageEntry = {
                topic: prompt,
                content_type: "Image",
                platform: "Studio Pro Canvas",
                variants: [{
                  content: prompt,
                  image_url: imageUrl,
                  title: `${style.toUpperCase()} Studio Design (${aspectRatio})`
                }],
                status: "completed"
              };
              addHistoryEntry(imageEntry).catch(err => console.error("Failed history save:", err));
              setGeneratedImage(imageUrl);
            }
          }
        },
        (finalStatus) => {
          setIsPolling(false);
          setStageStartedAt(null);
          const statusCode = finalStatus?.status || 'failed';
          setPollingStatus(statusCode);
          
          if (statusCode === 'completed' && finalStatus?.result) {
            const imageUrl = finalStatus?.result?.image_url || finalStatus?.result?.imageUrl;
            if (imageUrl) {
              setGeneratedImage(imageUrl);
            } else {
              setPollingStatus('failed');
            }
          } else {
            setPollingStatus('failed');
          }
        },
        3000
      );
    },
    onError: () => {
      setIsPolling(false);
      setStageStartedAt(null);
      setPollingStatus('failed');
    },
  });

  const submitGeneration = useCallback(() => {
    generateMutation.mutate({
      prompt: prompt.trim(),
      style: style,
      lighting: lighting,
      aspectRatio: aspectRatio
    });
  }, [prompt, style, lighting, aspectRatio, generateMutation]);

  const handleGenerateClick = () => {
    if (!prompt.trim()) return;
    setShowConfirmDialog(true);
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage, { method: 'GET', mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `studio-asset-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = generatedImage;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          const fallbackUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = fallbackUrl;
          link.download = `studio-asset-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(fallbackUrl);
        }, 'image/png');
      };
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt('');
    setPollingStatus(null);
    setStageStartedAt(null);
  };

  // Helper utility function to dynamically adjust preview container orientation
  const getAspectRatioClass = () => {
    if (aspectRatio === '16:9') return 'aspect-[16/9] w-full max-w-[440px]';
    if (aspectRatio === '9:16') return 'aspect-[9/16] h-[380px] w-auto';
    return 'aspect-square w-full max-w-[380px]';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Camera className="w-8 h-8 text-primary" />
            Image Studio Pro
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced asset laboratory designed for professional art style mapping and high-fidelity rendering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-muted/30 border border-border/70 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Advanced Consistency</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Appends deep aesthetic filters to guarantee exact model output alignment.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wand2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Illumination Control</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Fine-tune lighting layouts using advanced cinematic or studio nodes.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Standalone Production</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Enriched rendering blocks built explicitly for masterwork branding assets.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" />
                Studio Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Brief</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your creative vision..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[140px] resize-none"
                  disabled={isPolling}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Canvas Layout Dimensions</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isPolling}>
                  <SelectTrigger id="aspectRatio">
                    <Maximize2 className="w-4 h-4 mr-1 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPECT_RATIOS.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>{ratio.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lighting">Studio Illumination</Label>
                <Select value={lighting} onValueChange={setLighting} disabled={isPolling}>
                  <SelectTrigger id="lighting">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LIGHTING_MODES.map((light) => (
                      <SelectItem key={light.value} value={light.value}>{light.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Artistic Profile Style</Label>
                <Select value={style} onValueChange={setStyle} disabled={isPolling}>
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_STYLES.map((styleOption) => (
                      <SelectItem key={styleOption.value} value={styleOption.value}>{styleOption.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateClick}
                disabled={isPolling || !prompt.trim()}
                className="w-full mt-2"
                size="lg"
              >
                {isPolling ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Rendering Canvas...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Render Studio Asset</>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <Flame className="w-4 h-4 text-primary" />
                Studio Canvas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[440px] bg-muted/10 rounded-b-xl p-6">
              {isPolling || generateMutation.isPending ? (
                <div className="w-full space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary mt-0.5 relative">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="absolute inset-0 flex items-center justify-center animate-pulse text-[9px] font-bold">✨</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Generating image</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {pollingStatus === 'queued' 
                            ? 'Allocating compute nodes. Initializing layout engine models...' 
                            : 'This is an estimate based on recent image generation time. The image will appear automatically when the provider finishes.'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary tracking-tight">{displayProgressValue}%</p>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Estimated progress</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={displayProgressValue} className="h-2.5" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Elapsed: {formatRemainingTime(stageElapsedMs)}</span>
                      <span>{displayRemainingMs > 0 ? `About ${formatRemainingTime(displayRemainingMs)} remaining` : 'Finalizing result...'}</span>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 grid-cols-3 mt-2">
                    <div className={`rounded-xl border px-3 py-3 ${pollingStatus === 'preparing' ? 'border-primary/50 bg-primary/5' : 'border-border/70 bg-background/60'}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 1</p>
                      <p className="mt-1 text-xs font-medium text-foreground">Prepare Prompt</p>
                    </div>
                    <div className={`rounded-xl border px-3 py-3 ${pollingStatus === 'queued' || pollingStatus === 'processing' || pollingStatus === 'image' || isPolling ? 'border-primary/50 bg-primary/5' : 'border-border/70 bg-background/60'}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 2</p>
                      <p className="mt-1 text-xs font-medium text-foreground">Generate Image</p>
                    </div>
                    <div className={`rounded-xl border px-3 py-3 ${displayProgressValue >= 92 ? 'border-primary/50 bg-primary/5' : 'border-border/70 bg-background/60'}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 3</p>
                      <p className="mt-1 text-xs font-medium text-foreground">Finalize Result</p>
                    </div>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className={`relative border border-border/60 bg-background/50 shadow-inner overflow-hidden flex items-center justify-center p-1 rounded-lg ${getAspectRatioClass()}`}>
                    <img
                      src={generatedImage}
                      alt="Studio Output Visual"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="flex gap-3 w-full max-w-[380px]">
                    <Button onClick={handleDownload} className="flex-1"><Download className="w-4 h-4 mr-2" /> Download Asset</Button>
                    <Button onClick={handleReset} variant="outline" className="flex-1"><RefreshCw className="w-4 h-4 mr-2" /> Reset Canvas</Button>
                  </div>
                </div>
              ) : pollingStatus === 'failed' ? (
                <div className="text-center space-y-3">
                  <p className="text-sm text-red-500 font-semibold">Compilation interrupted or failed.</p>
                  <Button size="sm" variant="outline" onClick={handleReset} className="gap-2">
                    <RefreshCw className="w-3.5 h-3.5" /> Try Again
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border/80 rounded-xl flex flex-col items-center justify-center bg-background/40 p-6 w-full aspect-square max-w-[380px]">
                  <Camera className="w-10 h-10 text-muted-foreground mb-2 stroke-[1.5]" />
                  <p className="text-xs text-muted-foreground text-center font-medium">
                    Ready to capture custom art profile weights.
                  </p>
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
        title="Confirm Custom Studio Generation"
        description="High-fidelity image canvas compiling can utilize up to 2-3 minutes of render cluster time. Please maintain this viewport session active."
        confirmLabel="Initialize Render Pipeline"
      />
    </div>
  );
}