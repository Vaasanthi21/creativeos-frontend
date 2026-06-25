import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startAsyncImageGeneration, createGenerationPoller } from '@/services/generationPollingService';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Download, RefreshCw, Camera } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { addHistoryEntry } from '@/services/aiService';
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";

// Style options
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

export default function ImageStudio() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingStatus, setPollingStatus] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Image generation mutation
  const generateMutation = useMutation({
    mutationFn: async (params) => {
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
      // Fetch data via cross-origin blob stream to trigger native save-file action dialog
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
              {/* Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[140px]"
                />
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={style} onValueChange={setStyle}>
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

              {/* Generate Button */}
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

              {/* Polling Status UI */}
              {(generateMutation.isPending || isPolling) && pollingStatus && (
                <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Status: <span className="capitalize text-primary">{pollingStatus}</span></span>
                  </div>
                  {pollingStatus === 'queued' && (
                    <p className="text-xs text-muted-foreground">Queued in system. Preparing image engine context...</p>
                  )}
                  {pollingStatus === 'processing' && (
                    <p className="text-xs text-muted-foreground">The AI engine is rendering asset fragments. Please hold on...</p>
                  )}
                </div>
              )}
              
              {pollingStatus === 'failed' && (
                <p className="text-sm text-center text-red-500 font-medium">Generation failed. Please try a different prompt structure.</p>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Generated Image */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
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
                      {generateMutation.isPending || isPolling
                        ? 'Image synthesis workspace initializing...'
                        : 'Enter a creative prompt brief and click generate to begin.'}
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