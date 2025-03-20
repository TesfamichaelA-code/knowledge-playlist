
import React, { useState, useEffect } from 'react';
import { Resource } from '@/utils/data';
import { Check, Clock, ArrowLeft, ExternalLink, BookOpen, Trash } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { deleteResource } from '@/services/learningPathService';

interface ResourceViewerProps {
  resource: Resource;
  categoryId: string;
  onProgressUpdate?: (progress: number) => void;
  onMarkCompleted?: (completed: boolean) => void;
}

// Helper function to get embedded URL
const getEmbedUrl = (url: string, type: string): string => {
  // Handle YouTube URLs
  if (type === 'video' && url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Handle YouTube short URLs
  if (type === 'video' && url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  // Handle Vimeo URLs
  if (type === 'video' && url.includes('vimeo.com')) {
    const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }
  
  // Default - return original URL 
  // For documents, articles, etc. we display them directly
  return url;
};

const ResourceViewer: React.FC<ResourceViewerProps> = ({ 
  resource, 
  categoryId,
  onProgressUpdate,
  onMarkCompleted 
}) => {
  const [progress, setProgress] = useState(resource.progress);
  const [completed, setCompleted] = useState(resource.completed);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  // Sync component state with props when resource changes
  useEffect(() => {
    setProgress(resource.progress);
    setCompleted(resource.completed);
  }, [resource]);

  const handleMarkAsCompleted = () => {
    const newCompletedState = !completed;
    setCompleted(newCompletedState);
    if (newCompletedState) {
      setProgress(100);
    }
    
    // Call the callback if provided
    if (onMarkCompleted) {
      onMarkCompleted(newCompletedState);
    }
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
    if (newProgress === 100) {
      setCompleted(true);
      if (onMarkCompleted) {
        onMarkCompleted(true);
      }
    }
    
    // Call the callback if provided
    if (onProgressUpdate) {
      onProgressUpdate(newProgress);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      try {
        await deleteResource(resource.id);
        toast({
          title: "Resource deleted",
          description: "The resource has been successfully deleted",
        });
        navigate(`/category/${categoryId}`);
      } catch (error) {
        console.error('Error deleting resource:', error);
        toast({
          title: "Error",
          description: "Could not delete the resource. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const embedUrl = resource.url ? getEmbedUrl(resource.url, resource.type) : '';

  const renderResourceContent = () => {
    if (!embedUrl) {
      return (
        <div className="flex items-center justify-center h-80 bg-secondary rounded-lg">
          <p>Content not available for preview</p>
        </div>
      );
    }

    switch (resource.type) {
      case 'video':
        return (
          <div className={cn(
            "aspect-video w-full rounded-lg overflow-hidden bg-black",
            isFullscreen && "fixed inset-0 z-50 aspect-auto rounded-none"
          )}>
            <iframe
              src={embedUrl}
              title={resource.title}
              className="w-full h-full"
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            {isFullscreen && (
              <Button
                variant="secondary"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                onClick={() => setIsFullscreen(false)}
              >
                Exit Fullscreen
              </Button>
            )}
          </div>
        );
      case 'article':
      case 'documentation':
      case 'pdf':
        return (
          <div className={cn(
            "w-full rounded-lg overflow-hidden border h-[600px]",
            isFullscreen && "fixed inset-0 z-50 h-screen rounded-none"
          )}>
            <iframe
              src={embedUrl}
              title={resource.title}
              className="w-full h-full"
              frameBorder="0"
            />
            {isFullscreen && (
              <Button
                variant="secondary"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                onClick={() => setIsFullscreen(false)}
              >
                Exit Fullscreen
              </Button>
            )}
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-80 bg-secondary rounded-lg">
            <p>Content not available for preview</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to={`/category/${categoryId}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to category</span>
        </Link>
        
        <div className="flex gap-3">
          <Button
            variant="outline" 
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-sm"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="text-sm"
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
          
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open in new tab</span>
          </a>
        </div>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{resource.title}</h1>
        <p className="text-muted-foreground">{resource.description}</p>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{resource.duration} minutes</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
          </div>
        </div>
      </div>
      
      {!isFullscreen && renderResourceContent()}
      {isFullscreen && renderResourceContent()}
      
      {!isFullscreen && (
        <div className="glass-card rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">Your Progress</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>
          
          <div className="flex flex-wrap gap-3">
            {[25, 50, 75, 100].map((value) => (
              <button
                key={value}
                onClick={() => handleProgressUpdate(value)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full border transition-colors",
                  progress >= value
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-muted-foreground/30 hover:border-muted-foreground/50"
                )}
              >
                {value}%
              </button>
            ))}
          </div>
          
          <Button
            onClick={handleMarkAsCompleted}
            variant={completed ? "secondary" : "default"}
            className={cn(
              "w-full py-2 rounded-md flex items-center justify-center gap-2 transition-colors",
              completed && "bg-primary/20 text-primary hover:bg-primary/30"
            )}
          >
            {completed ? (
              <>
                <Check className="h-4 w-4" />
                <span>Completed - Mark as Incomplete</span>
              </>
            ) : (
              "Mark as completed"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ResourceViewer;
