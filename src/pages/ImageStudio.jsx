import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { startAsyncImageGeneration, pollImageStatus, createGenerationPoller } from '@/services/generationPollingService';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Download, RefreshCw, Camera } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { addHistoryEntry } from '@/services/aiService';

// Aspect ratio options - using Azure image sizes
const ASPECT_RATIOS = [
  { value: '1024x1024', label: '1:1 (Square) - 1024x1024' },
  { value: '1024x768', label: '4:3 (Classic) - 1024x768' },
  { value: '768x1024', label: '3:4 (Portrait) - 768x1024' },
  { value: '1024x576', label: '16:9 (Landscape) - 1024x576' },
  { value: '576x1024', label: '9:16 (Portrait) - 576x1024' },
];

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
  const [aspectRatio, setAspectRatio] = useState('1024x1024');
  const [style, setStyle] = useState('realistic');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingStatus, setPollingStatus] = useState(null);

  // Image generation mutation
  const generateMutation = useMutation({
    mutationFn: async (params) => {
      // Start async generation with correct parameters
      const response = await startAsyncImageGeneration({
        topic: params.prompt,
        aspectRatio: params.aspectRatio,
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
      
      // Start polling
      const poller = createGenerationPoller(
        jobId,
        'image',
        (status) => {
          // Extract status from the payload
          const statusCode = status.status || pollingStatus;
          setPollingStatus(statusCode);
          
          // Check if completed and extract image URL from result
          if (statusCode === 'completed' && status.result) {
            const imageUrl = status.result.image_url || status.result.imageUrl;
            if (imageUrl) {
              
              // Save to history
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

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    generateMutation.mutate({
      prompt: prompt.trim(),
      aspectRatio: aspectRatio,
      style: style,
    });
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
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
            Generate stunning AI-powered images with custom styles and aspect ratios
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
                  className="min-h-[120px]"
                />
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select aspect ratio" />
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
                onClick={handleGenerate}
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

              {/* Polling Status */}
              {isPolling && pollingStatus && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Status: <span className="font-medium">{pollingStatus}</span>
                  </p>
                  {pollingStatus === 'completed' && (
                    <p className="text-sm text-primary">Image generated successfully!</p>
                  )}
                  {pollingStatus === 'failed' && (
                    <p className="text-sm text-red-500">Generation failed. Please try again.</p>
                  )}
                  {pollingStatus === 'processing' && (
                    <p className="text-sm text-muted-foreground">Processing your image...</p>
                  )}
                  {pollingStatus === 'queued' && (
                    <p className="text-sm text-muted-foreground">Queued for generation...</p>
                  )}
                </div>
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
                      alt="Generated image"
                      className="w-full h-auto object-contain"
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
                    <p className="text-muted-foreground">
                      {generateMutation.isPending || isPolling
                        ? 'Your image is being generated...'
                        : 'Enter a prompt and click Generate to create your image'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}