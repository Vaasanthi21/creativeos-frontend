import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Download, RefreshCw, Video, Play, Pause, Volume2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { apiClient, tokenStorage } from '@/api/apiClient';
import { addHistoryEntry } from '@/services/aiService';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
];

const VIDEO_STYLES = [
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'animated', label: 'Animated' },
  { value: 'live-action', label: 'Live Action' },
  { value: 'minimalist', label: 'Minimalist' },
];

const VIDEO_ASPECT_RATIOS = [
  { value: '1080x1080', label: '1:1 (Square) - 1080x1080' },
  { value: '1080x1920', label: '9:16 (Portrait) - 1080x1920' },
  { value: '1920x1080', label: '16:9 (Landscape) - 1920x1080' },
  { value: '1080x1350', label: '4:5 (Portrait) - 1080x1350' },
];

export default function VideoStudio() {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [style, setStyle] = useState('cinematic');
  const [aspectRatio, setAspectRatio] = useState('1080x1080');
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingStatus, setPollingStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const [pan, setPan] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [motionStrength, setMotionStrength] = useState(5);
  
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef(null);

  const generateMutation = useMutation({
    mutationFn: async (params) => {
      const token = tokenStorage.getUserToken();
      if (!token) {
        throw new Error('User token not available');
      }

      const response = await apiClient.post('/generate-video', {
        topic: params.prompt,
        platform: params.platform,
        contentType: params.style,
        async: true,
      }, token);

      return response;
    },
    onSuccess: (response) => {
      console.log('Video generation started:', response);
      const jobId = response.video_id || response.jobId || response.id || response.job_id;

      if (!jobId) {
        console.error('No job ID returned', response);
        setPollingStatus('failed');
        setIsPolling(false);
        setErrorMessage('No job ID returned from server');
        return;
      }

      setIsPolling(true);
      setPollingStatus('queued');
      setErrorMessage(null);

      const pollInterval = setInterval(async () => {
        try {
          const token = tokenStorage.getUserToken();
          const statusResponse = await apiClient.get(
            `/video-status/${encodeURIComponent(jobId)}`,
            token
          );

          console.log('Video status update:', statusResponse);

          const statusCode = statusResponse.status;

          setPollingStatus(statusCode);

          if (statusCode === 'completed') {
            clearInterval(pollInterval);
            setIsPolling(false);
            
            if (statusResponse.video_url) {
              setGeneratedVideo(statusResponse.video_url);
              
              // Save to history
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
            setPollingStatus('failed');
            setErrorMessage(statusResponse.error || 'Video generation failed');
          }
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 3000);
    },
    onError: (error) => {
      console.error('Video generation failed:', error);
      setIsPolling(false);
      setPollingStatus('failed');
      setErrorMessage(error.message || 'Video generation failed');
    },
  });

  const handleAnimate = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt first');
      return;
    }
    setShowCameraModal(true);
  };

  const handleGenerateVideo = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    setErrorMessage(null);
    generateMutation.mutate({
      prompt: prompt.trim(),
      platform: platform,
      style: style,
    });
  };

  const handleDownload = async () => {
    if (!generatedVideo) return;
    try {
      const response = await fetch(generatedVideo);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-video-${Date.now()}.mp4`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Download failed.');
    }
  };

  const handleReset = () => {
    setGeneratedVideo(null);
    setPrompt('');
    setPollingStatus(null);
    setIsPlaying(false);
    setErrorMessage(null);
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

  // Check if button should be disabled
  const isButtonDisabled = !prompt.trim();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Video className="w-8 h-8 text-primary" />
            Video Studio
          </h1>
          <p className="text-muted-foreground mt-2">
            Create stunning AI-powered videos with camera controls
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle>Video Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the video you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger>
                  <SelectContent>
                    {VIDEO_STYLES.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger><SelectValue placeholder="Select aspect ratio" /></SelectTrigger>
                  <SelectContent>
                    {VIDEO_ASPECT_RATIOS.map((r) => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAnimate} disabled={!prompt.trim()} className="w-full" variant="outline">
                <Sparkles className="w-4 h-4 mr-2" /> Animate with Camera Control
              </Button>

              <Button 
                onClick={handleGenerateVideo} 
                disabled={isButtonDisabled} 
                className="w-full" 
                size="lg"
              >
                {generateMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                ) : (
                  <><Video className="w-4 h-4 mr-2" /> Generate Video</>
                )}
              </Button>

              {errorMessage && (
                <div className="text-center p-3 bg-red-500/10 border border-red-500 rounded">
                  <p className="text-sm text-red-500">⚠️ {errorMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please add credits to your account to generate videos
                  </p>
                </div>
              )}

              {isPolling && pollingStatus && !errorMessage && (
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Status: <span className="text-primary">{pollingStatus}</span></p>
                  {pollingStatus === 'completed' && <p className="text-sm text-primary">✓ Video generated!</p>}
                  {pollingStatus === 'failed' && <p className="text-sm text-red-500">✗ Failed.</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Generated Video</CardTitle></CardHeader>
            <CardContent>
              {generatedVideo ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border bg-black">
                    <video ref={videoRef} src={generatedVideo} className="w-full h-auto" style={{ minHeight: '300px', maxHeight: '500px' }} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex items-center gap-3">
                      <Button onClick={togglePlay} size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-white" />
                        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} className="w-20 h-1 bg-white/30 rounded-lg" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1"><Download className="w-4 h-4 mr-2" /> Download</Button>
                    <Button onClick={handleReset} variant="outline" className="flex-1"><RefreshCw className="w-4 h-4 mr-2" /> New Video</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] border rounded-lg bg-muted/20">
                  <div className="text-center">
                    <Video className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">{isPolling ? 'Generating...' : 'Enter a prompt and click Generate'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {showCameraModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b"><h2 className="text-xl font-semibold">Camera Control</h2></div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Pan: {pan.toFixed(1)}</Label>
                <input type="range" min="-10" max="10" step="0.1" value={pan} onChange={(e) => setPan(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label>Zoom: {zoom.toFixed(1)}</Label>
                <input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label>Motion Strength: {motionStrength}</Label>
                <input type="range" min="1" max="10" step="1" value={motionStrength} onChange={(e) => setMotionStrength(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>
            <div className="p-6 border-t flex gap-2 justify-end">
              <Button onClick={() => setShowCameraModal(false)} variant="outline">Close</Button>
              <Button onClick={() => { setShowCameraModal(false); handleGenerateVideo(); }}><Sparkles className="w-4 h-4 mr-2" /> Generate</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
