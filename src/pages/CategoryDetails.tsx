
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, ChevronLeft, Loader2, Plus, Trash } from 'lucide-react';
import ResourceCard from '@/components/ResourceCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AddResourceDialog } from '@/components/AddResourceDialog';
import { 
  fetchLearningPathById,
  fetchResourcesByPathId,
  deleteLearningPath,
  createResource
} from '@/services/learningPathService';

const CategoryDetails = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [addResourceDialogOpen, setAddResourceDialogOpen] = useState(false);
  
  if (!categoryId) {
    navigate('/');
    return null;
  }

  const { data: category, isLoading: isLoadingCategory } = useQuery({
    queryKey: ['learningPath', categoryId],
    queryFn: () => fetchLearningPathById(categoryId),
  });

  const { data: resources, isLoading: isLoadingResources } = useQuery({
    queryKey: ['resources', categoryId],
    queryFn: () => fetchResourcesByPathId(categoryId),
    enabled: !!categoryId,
  });

  const handleDeleteCategory = async () => {
    try {
      if (window.confirm('Are you sure you want to delete this learning path? This action cannot be undone.')) {
        await deleteLearningPath(categoryId);
        toast({
          title: 'Success',
          description: 'Learning path deleted successfully',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting learning path:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete learning path. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddResource = async (values: any) => {
    const nextPosition = resources?.length ? resources.length : 0;
    
    await createResource({
      path_id: categoryId,
      title: values.title,
      type: values.type,
      url: values.url,
      description: values.description,
      position: nextPosition,
      progress: 0,
      completed: false,
      duration: 30 // Default duration
    });
    
    queryClient.invalidateQueries({ queryKey: ['resources', categoryId] });
  };

  if (isLoadingCategory || isLoadingResources) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Learning path not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="page-container space-y-6 py-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex-1" />
        
        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleDeleteCategory}
        >
          <Trash className="mr-1 h-4 w-4" />
          Delete Path
        </Button>
      </div>
      
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold">{category.title}</h1>
        <p className="text-muted-foreground">{category.description || 'No description provided'}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{resources?.length || 0} Resources</span>
        </div>
        
        <Button size="sm" onClick={() => setAddResourceDialogOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add Resource
        </Button>
      </div>
      
      {resources && resources.length > 0 ? (
        <div className="grid gap-4">
          {resources.map((resource, index) => (
            <ResourceCard 
              key={resource.id}
              resource={{
                id: resource.id,
                title: resource.title,
                description: resource.description || '',
                type: resource.type as 'video' | 'article' | 'documentation' | 'pdf',
                url: resource.url || '',
                progress: resource.progress || 0, 
                completed: resource.completed || false,
                duration: resource.duration || 30
              }}
              number={index + 1}
              categoryId={categoryId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No resources added yet</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setAddResourceDialogOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add your first resource
          </Button>
        </div>
      )}

      <AddResourceDialog
        open={addResourceDialogOpen}
        onOpenChange={setAddResourceDialogOpen}
        onAddResource={handleAddResource}
        pathId={categoryId}
      />
    </div>
  );
};

export default CategoryDetails;
