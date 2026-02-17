
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Circle, Trash2 } from 'lucide-react';
import { Resource } from '@/types';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ResourceCardProps {
  resource: Resource;
  categoryId: string;
  number?: number;
  onDelete?: (resourceId: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, categoryId, number, onDelete }) => {
  const getResourceTypeIcon = () => {
    switch (resource.type) {
      case 'video':
        return '▶️ Video';
      case 'article':
        return '📝 Article';
      case 'documentation':
        return '📚 Documentation';
      case 'pdf':
        return '📄 PDF';
      default:
        return '📄 Resource';
    }
  };
  
  return (
    <Link 
      to={`/category/${categoryId}/resource/${resource.id}`}
      className="glass-card rounded-lg overflow-hidden hover-scale flex flex-col"
    >
      {resource.thumbnail && (
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={resource.thumbnail} 
            alt={resource.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute top-2 left-2 bg-black/70 text-xs font-medium text-white px-2 py-1 rounded-full">
            {getResourceTypeIcon()}
          </div>
          
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-xs font-medium text-white px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>{resource.duration} min</span>
          </div>
        </div>
      )}
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-medium text-foreground">
            {number && <span className="mr-2 text-muted-foreground">#{number}</span>}
            {resource.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm">
              {resource.completed ? (
                <CheckCircle className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={cn(
                "font-medium",
                resource.completed ? "text-primary" : "text-muted-foreground"
              )}>
                {resource.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {resource.progress}%
              </span>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(resource.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
          
          <ProgressBar value={resource.progress} />
        </div>
      </div>
    </Link>
  );
};

export default ResourceCard;
