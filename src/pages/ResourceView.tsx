
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchResourceById, updateResource } from '@/services/learningPathService';
import ResourceViewer from '@/components/ResourceViewer';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ResourceView = () => {
  const { categoryId, resourceId } = useParams<{ categoryId: string; resourceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: resource, isLoading, error } = useQuery({
    queryKey: ['resource', resourceId],
    queryFn: () => fetchResourceById(resourceId || ''),
    enabled: !!resourceId,
  });
  
  useEffect(() => {
    if (resource) {
      document.title = `${resource.title} | Learning Path`;
      
      // Analytics tracking example (would connect to a real analytics service)
      console.log('Resource viewed:', resourceId);
    }
  }, [resource, resourceId]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !resource) {
    toast({
      title: "Error",
      description: "The resource you're looking for doesn't exist or couldn't be loaded.",
      variant: "destructive",
    });
    
    return <Navigate to={`/category/${categoryId}`} replace />;
  }

  const handleProgressUpdate = async (newProgress: number) => {
    try {
      // Update progress in the database
      await updateResource(resourceId || '', {
        progress: newProgress
      });
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['resource', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resources', categoryId] });
      
      // Show toast notification
      toast({
        title: "Progress updated",
        description: `${resource.title} - ${newProgress}% complete`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error updating progress",
        description: "There was a problem updating your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkCompleted = async (completed: boolean) => {
    try {
      // Update completion status in the database
      await updateResource(resourceId || '', {
        completed: completed,
        progress: completed ? 100 : 0
      });
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['resource', resourceId] });
      queryClient.invalidateQueries({ queryKey: ['resources', categoryId] });
      
      // Show toast notification
      toast({
        title: completed ? "Resource completed" : "Progress reset",
        description: completed 
          ? `You've completed "${resource.title}"` 
          : `"${resource.title}" marked as in progress`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error updating completion status:', error);
      toast({
        title: "Error updating status",
        description: "There was a problem updating the completion status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Convert the Supabase resource to the expected Resource format for ResourceViewer
  const viewerResource = {
    id: resource.id,
    title: resource.title,
    description: resource.description || '',
    type: resource.type as 'video' | 'article' | 'documentation' | 'pdf',
    url: resource.url || '',
    progress: resource.progress || 0,
    completed: resource.completed || false,
    duration: resource.duration || 30
  };

  return (
    <div className="page-container py-6">
      <ResourceViewer 
        resource={viewerResource}
        categoryId={categoryId || ''} 
        onProgressUpdate={handleProgressUpdate}
        onMarkCompleted={handleMarkCompleted}
      />
    </div>
  );
};

export default ResourceView;
