import { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Download, RefreshCw, Video, Play, Pause, Volume2, Film, Sliders, Eye, Wand2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { apiClient, tokenStorage } from '@/api/apiClient';
import { addHistoryEntry } from '@/services/aiService';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
];

const VIDEO_STYLES = [
  { value: 'cinematic', label: 'Cinematic Hyper-Real' },
  { value: 'documentary', label: 'Documentary Realism' },
  { value: 'promotional', label: 'High-Impact Promotional' },
  { value: 'testimonial', label: 'Authentic Testimonial' },
  { value: 'tutorial', label: 'Crisp E-Learning Tutorial' },
  { value: 'animated', label: '3D Stylized Animated' },
  { value: 'live-action', label: 'Natural Live Action' },
  { value: 'minimalist', label: 'Clean Editorial Minimalist' },
];

const ESTIMATED_TOTAL_MS = 600000; // 10 minutes total video processing allocation

const formatRemainingTime = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
};

export default function VideoStudio() {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [style, setStyle] = useState('cinematic');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingStatus, setPollingStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const [pan, setPan] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [motionStrength, setMotionStrength] = useState(5);
  
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef(null);

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
      const token = tokenStorage.getUserToken();
      if (!token) {
        throw new Error('User token not available');
      }

      const response = await apiClient.post('/generate-video', {
        topic: params.prompt,
        platform: params.platform,
        contentType: params.style,
        cameraPan: params.pan,
        cameraZoom: params.zoom,
        motionStrength: params.motionStrength,
        async: true,
      }, token);

      return response;
    },
    onSuccess: (response) => {
      const jobId = response.video_id || response.jobId || response.id || response.job_id;

      if (!jobId) {
        setPollingStatus('failed');
        setIsPolling(false);
        setErrorMessage('No job ID returned from server');
        return;
      }

      setIsPolling(true);
      setStageStartedAt(Date.now());
      setPollingStatus('queued');
      setErrorMessage(null);

      const pollInterval = setInterval(async () => {
        try {
          const token = tokenStorage.getUserToken();
          const statusResponse = await apiClient.get(
            `/video-status/${encodeURIComponent(jobId)}`,
            token
          );

          const statusCode = statusResponse.status;
          setPollingStatus(statusCode);

          if (statusCode === 'completed') {
            clearInterval(pollInterval);
            setIsPolling(false);
            setStageStartedAt(null);
            
            if (statusResponse.video_url) {
              setGeneratedVideo(statusResponse.video_url);
              
              const videoEntry = {
                topic: statusResponse.prompt || prompt,
                content_type: "Video",
                platform: platform,
                variants: [{
                  content: statusResponse.prompt || prompt,
                  video_url: statusResponse.video_url,
                  title: platform + " Video"
                }],
                status: "completed"
              };
              addHistoryEntry(videoEntry).catch(err => console.error("Failed to save video to history:", err));
              setPollingStatus('completed');
              setErrorMessage(null);
            }
          } else if (statusCode === 'failed') {
            clearInterval(pollInterval);
            setIsPolling(false);
            setStageStartedAt(null);
            setPollingStatus('failed');
            setErrorMessage(statusResponse.error || 'Video generation failed');
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 3000);
    },
    onError: (error) => {
      setIsPolling(false);
      setStageStartedAt(null);
      setPollingStatus('failed');
      setErrorMessage(error.message || 'Video generation failed');
    },
  });

  const submitGeneration = useCallback(() => {
    generateMutation.mutate({
      prompt: prompt.trim(),
      platform: platform,
      style: style,
      pan: pan,
      zoom: zoom,
      motionStrength: motionStrength
    });
  }, [prompt, platform, style, pan, zoom, motionStrength, generateMutation]);

  const handleAnimate = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt first');
      return;
    }
    setShowCameraModal(true);
  };

  const handleGenerateClick = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    setErrorMessage(null);
    setShowConfirmDialog(true);
  };

  const handleDownload = async () => {
    if (!generatedVideo) return;
    try {
      const response = await fetch(generatedVideo, { mode: 'cors' });
      if (!response.ok) throw new Error("Network request rejected by file provider");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `creativeos-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const a = document.createElement('a');
      a.href = generatedVideo;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('download', `creativeos-video-${Date.now()}.mp4`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleReset = () => {
    setGeneratedVideo(null);
    setPrompt('');
    setPollingStatus(null);
    setIsPlaying(false);
    setErrorMessage(null);
    setStageStartedAt(null);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    if (videoRef.current) videoRef.current.volume = value;
  };

  const isButtonDisabled = !prompt.trim() || generateMutation.isPending || isPolling;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Block */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Video className="w-8 h-8 text-primary" />
            Video Studio Pro
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced motion picture engine designed for granular camera manipulation and multi-platform scenario generation.
          </p>
        </div>

        {/* 💡 Feature Differentiation Explainer Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-muted/30 border border-border/70 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Kinetic Control Panels</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Manipulate complex physical attributes like camera panning matrices, focal zoom speeds, and animation motion weight parameters.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Film className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Target Platform Sizing</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Bake custom timeline containers formatted perfectly for distribution rules across primary global video distribution networks.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Wand2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Standalone Render Core</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">High-end computing blocks optimized specifically for generating autonomous timeline footage clips without needing post context fields.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Video Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-primary" />
                Studio Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt Brief Scenario</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your scene trajectory, subjects, and lighting environment details..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[140px] resize-none"
                  disabled={generateMutation.isPending || isPolling}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Target Platform Layout</Label>
                <Select value={platform} onValueChange={setPlatform} disabled={generateMutation.isPending || isPolling}>
                  <SelectTrigger><SelectValue placeholder="Select network shell" /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Artistic Direction Style</Label>
                <Select value={style} onValueChange={setStyle} disabled={generateMutation.isPending || isPolling}>
                  <SelectTrigger><SelectValue placeholder="Select style matrix" /></SelectTrigger>
                  <SelectContent>
                    {VIDEO_STYLES.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleAnimate} disabled={!prompt.trim() || generateMutation.isPending || isPolling} className="flex-1 gap-2" variant="outline">
                  <Sliders className="w-4 h-4" /> Camera Controls ({pan !== 0 || zoom !== 1 || motionStrength !== 5 ? "Modified" : "Default"})
                </Button>
                
                <Button 
                  onClick={handleGenerateClick} 
                  disabled={isButtonDisabled} 
                  className="flex-1 gap-2" 
                  size="lg"
                >
                  {generateMutation.isPending || isPolling ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Rendering...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Render Studio Video</>
                  )}
                </Button>
              </div>

              {errorMessage && (
                <div className="text-center p-3 bg-red-500/10 border border-red-500 rounded-lg">
                  <p className="text-sm text-red-500 font-semibold">{errorMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">Please append credits to your wallet dashboard to execute complex render frames.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Studio Viewport Frame Container */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-md flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                Studio Viewport
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[440px] bg-muted/10 rounded-b-xl p-6">
              {isPolling || generateMutation.isPending ? (
                <div className="w-full bg-card border border-border rounded-xl p-6 flex flex-col justify-center min-h-[400px] gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/10 p-2 text-primary mt-0.5">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Compiling Video Timeline</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {pollingStatus === 'queued'
                            ? 'Queued in frame sequencer pipeline. Preparing simulation context...'
                            : 'Neural cluster nodes are rendering high-resolution scene intervals.'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary tracking-tight">{displayProgressValue}%</p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Estimated progress</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={displayProgressValue} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Elapsed: {formatRemainingTime(stageElapsedMs)}</span>
                      <span>
                        {displayRemainingMs > 0
                          ? `About ${formatRemainingTime(displayRemainingMs)} remaining`
                          : 'Finalizing timeline encoding...'}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 grid-cols-3 mt-2">
                    <div className={`rounded-xl border px-3 py-3 ${pollingStatus === 'preparing' ? 'border-primary/50 bg-primary/5' : 'border-border/70 bg-background/60'}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 1</p>
                      <p className="mt-1 text-xs font-medium text-foreground">Prepare Prompt</p>
                    </div>
                    <div className={`rounded-xl border px-3 py-3 ${pollingStatus === 'queued' || pollingStatus === 'processing' ? 'border-primary/50 bg-primary/5' : 'border-border/70 bg-background/60'}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 2</p>
                      <p className="mt-1 text-xs font-medium text-foreground">Generate Video</p>
                    </div>
                    <div className={`rounded-xl border px-3 py-3 ${displayProgressValue >= 92 ? 'border-primary/50 bg-primary/5' : 'border-border/70 bg-background/60'}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Step 3</p>
                      <p className="mt-1 text-xs font-medium text-foreground">Finalize Result</p>
                    </div>
                  </div>
                </div>
              ) : generatedVideo ? (
                <div className="w-full space-y-4">
                  <div className="relative rounded-xl overflow-hidden border bg-black shadow-lg">
                    <video ref={videoRef} src={generatedVideo} controls className="w-full h-auto" style={{ minHeight: '300px', maxHeight: '500px' }} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center gap-3 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <Button onClick={togglePlay} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-white" />
                        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} className="w-20 h-1 bg-white/30 rounded-lg accent-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleDownload} className="flex-1 gap-2"><Download className="w-4 h-4" /> Download Video</Button>
                    <Button onClick={handleReset} variant="outline" className="flex-1 gap-2"><RefreshCw className="w-4 h-4" /> Reset Canvas</Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border/80 rounded-xl flex flex-col items-center justify-center bg-background/40 p-6 w-full max-w-[380px] aspect-square">
                  <Film className="w-12 h-12 text-muted-foreground mb-3 stroke-[1.5]" />
                  <p className="text-xs text-muted-foreground text-center font-medium px-4">
                    Enter a creative scenario and render to review your studio cinematic footage timeline.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Camera Control Modal Config */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border border-border/70 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b bg-muted/20">
              <h2 className="text-md font-semibold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" /> Camera Direction Configurations
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center"><Label>Horizontal Pan Sizing</Label><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-foreground font-bold">{pan.toFixed(1)}</span></div>
                <input type="range" min="-10" max="10" step="0.1" value={pan} onChange={(e) => setPan(parseFloat(e.target.value))} className="w-full accent-primary" />
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>← Pan Left</span><span>Center</span><span>Pan Right →</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center"><Label>Focal Zoom Scale</Label><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-foreground font-bold">{zoom.toFixed(1)}x</span></div>
                <input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full accent-primary" />
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>Zoom Out</span><span>1.0x (Normal)</span><span>Zoom In</span></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center"><Label>Timeline Motion Strength</Label><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-foreground font-bold">{motionStrength}</span></div>
                <input type="range" min="1" max="10" step="1" value={motionStrength} onChange={(e) => setMotionStrength(parseInt(e.target.value))} className="w-full accent-primary" />
                <div className="flex justify-between text-[10px] text-muted-foreground"><span>Subtle Motion</span><span>Intense Motion</span></div>
              </div>
            </div>
            <div className="p-4 border-t bg-muted/20 flex gap-2 justify-end">
              <Button onClick={() => setShowCameraModal(false)} variant="outline" size="sm">Cancel Layout</Button>
              <Button size="sm" onClick={() => { setShowCameraModal(false); handleGenerateClick(); }}><Sparkles className="w-3.5 h-3.5 mr-1.5" /> Confirm Direction</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          setShowConfirmDialog(false);
          submitGeneration();
        }}
        title="Confirm Custom Studio Generation"
        description="Complex camera projection trajectories and high-fidelity video processing models can take up to 5-10 minutes to compile. Please leave this studio viewport session active."
        confirmLabel="Initialize Render Pipeline"
      />
    </div>
  );
}