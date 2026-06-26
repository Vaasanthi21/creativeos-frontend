import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startAsyncImageGeneration, createGenerationPoller } from '@/services/generationPollingService';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Download, RefreshCw, Camera, Layers, Sliders, Maximize, Flame, Wand2 } from 'lucide-react';
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

const ASPECT_RATIOS = [
  { value: '16:9', label: '16:9 Landscape (YouTube, Website)' },
  { value: '1:1', label: '1:1 Square (Instagram, Ads)' },
  { value: '9:16', label: '9:16 Portrait (Reels, Shorts)' },
  { value: '4:5', label: '4:5 Vertical (Social Feeds)' },
];

const LIGHTING_MODES = [
  { value: 'natural', label: 'Natural Soft Light' },
  { value: 'cinematic', label: 'Cinematic Volumetric' },
  { value: 'neon', label: 'Cyberpunk Neon Cyber Glow' },
  { value: 'studio', label: 'Studio Three-Point Lighting' },
  { value: 'dramatic', label: 'Dramatic Chiaroscuro' },
];

const ESTIMATED_TOTAL_MS = 180000;

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
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [lighting, setLighting] = useState('cinematic');
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
    ? Math.min(96, Math.max(8, Math.round((stageElapsedMs / ESTIMATED_TOTAL_MS) * 100)))
    : 0;

  const displayRemainingMs = Math.max(0, ESTIMATED_TOTAL_MS - stageElapsedMs);

  const generateMutation = useMutation({
    mutationFn: async (params) => {
      setPollingStatus('preparing');
      
      // 🚀 Map the chosen human aspect ratio format to pixel bounds expected by backend models
      let width = 1024;
      let height = 1024;

      if (params.aspectRatio === '16:9') {
        width = 1024;
        height = 576;
      } else if (params.aspectRatio === '9:16') {
        width = 576;
        height = 1024;
      } else if (params.aspectRatio === '4:5') {
        width = 819;
        height = 1024;
      }

      // Format clean, heavy prompt constraints
      const finalBuiltPrompt = `${params.prompt}, ${params.style} style, ${params.lighting} lighting, ultra-detailed masterwork`;
      
      const response = await startAsyncImageGeneration({
        topic: finalBuiltPrompt,
        style: params.style,
        aspectRatio: params.aspectRatio,
        aspect_ratio: params.aspectRatio,
        width: width,   // 🚀 Passed direct layout parameters
        height: height, // 🚀 Passed direct layout parameters
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
          if (!status) return; // 🚀 Guard clause against empty frames
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
                  title: `${style.toUpperCase()} Studio Design`
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
          
          const statusCode = finalStatus?.status || 'failed'; // 🚀 Safe navigation fallback
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
      aspectRatio: aspectRatio,
      lighting: lighting,
    });
  }, [prompt, style, aspectRatio, lighting, generateMutation]);

  const handleGenerateClick = () => {
    if (!prompt.trim()) return;
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
      link.download = `studio-pro-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(generatedImage, '_blank');
    }
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setPrompt('');
    setPollingStatus(null);
    setStageStartedAt(null);
  };

  const getDynamicFrameRatio = () => {
    if (aspectRatio === '16:9') return 'w-full aspect-video';
    if (aspectRatio === '9:16') return 'w-[240px] aspect-[9/16]';
    if (aspectRatio === '4:5') return 'w-[300px] aspect-[4/5]';
    return 'w-[360px] aspect-square max-w-full';
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
            Advanced asset laboratory designed for complete canvas geometry control and deep texture generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-muted/30 border border-border/70 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Advanced Consistency</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Appends layered rendering weights to guarantee precise model output alignment.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Maximize className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Geometric Canvas Sizing</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Forces exact target boundaries across specialized device viewports.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Standalone Fine-Tuning</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Enriched parameter nodes built specifically for high-end graphic assets.</p>
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
                  placeholder="Describe your vision in high-fidelity detail..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isPolling}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Target Geometry (Aspect Ratio)</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isPolling}>
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  <SelectTrigger>
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
              {isPolling ? (
                <div className="w-full space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <div>
                        <p className="text-sm font-semibold">Compiling Render Matrices</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {pollingStatus === 'queued' ? 'Arranging graphics core threads...' : 'Injecting lighting variables into raster blocks.'}
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-primary">{displayProgressValue}%</span>
                  </div>
                  <Progress value={displayProgressValue} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Elapsed: {formatRemainingTime(stageElapsedMs)}</span>
                    <span>{displayRemainingMs > 0 ? `~${formatRemainingTime(displayRemainingMs)} remaining` : 'Finalizing resolution...'}</span>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className={`relative border border-border/60 bg-background/50 shadow-inner overflow-hidden flex items-center justify-center p-1 max-h-[460px] ${getDynamicFrameRatio()}`}>
                    <img
                      src={generatedImage}
                      alt="Studio Output Visual"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div className="flex gap-3 w-full">
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
                <div className={`border-2 border-dashed border-border/80 rounded-xl flex flex-col items-center justify-center bg-background/40 p-4 transition-all duration-300 ${getDynamicFrameRatio()}`}>
                  <Camera className="w-10 h-10 text-muted-foreground mb-2 stroke-[1.5]" />
                  <p className="text-xs text-muted-foreground text-center font-medium px-2">
                    Canvas Shape Preset: <span className="text-primary font-bold font-mono">{aspectRatio}</span>
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