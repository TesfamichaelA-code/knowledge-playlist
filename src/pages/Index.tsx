
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import SearchBar from '@/components/SearchBar';
import { Layers, Loader2, Play } from 'lucide-react';
import { fetchLearningPathsWithStats, fetchContinueLearningResource } from '@/services/learningPathService';
import CreateLearningPathDialog from '@/components/CreateLearningPathDialog';
import { ProgressBar } from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { data: learningPaths, isLoading, error } = useQuery({
    queryKey: ['learningPathsWithStats'],
    queryFn: fetchLearningPathsWithStats,
  });

  const { data: continueResource } = useQuery({
    queryKey: ['continueLearning'],
    queryFn: fetchContinueLearningResource,
  });
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredPaths = learningPaths ? 
    learningPaths.filter(path => 
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (path.description && path.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) : [];

  return (
    <div className="page-container space-y-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
            <Layers className="h-3.5 w-3.5" />
            <span>Learning Paths</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome to Knowledge Playlist</h1>
          <p className="text-muted-foreground">Organize and track your learning journey</p>
        </div>
        
        <SearchBar onSearch={handleSearch} className="w-full sm:w-auto sm:min-w-[300px]" />
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Learning Paths</h2>
          <button 
            className="text-primary text-sm hover:underline flex items-center gap-1"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <span>+ Create new path</span>
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load learning paths</p>
            <button 
              className="mt-2 text-primary text-sm hover:underline"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : filteredPaths.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPaths.map((path) => (
              <CategoryCard 
                key={path.id} 
                category={path} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              {searchQuery 
                ? "No learning paths found matching your search." 
                : "You don't have any learning paths yet."}
            </p>
            <button 
              className="mt-2 text-primary hover:underline"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create your first learning path
            </button>
          </div>
        )}
      </div>
      
      {continueResource && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          
          <div className="glass-card rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="aspect-video md:w-1/3 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Play className="h-12 w-12 text-primary/60" />
            </div>
            
            <div className="md:w-2/3 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{continueResource.pathTitle}</p>
                <h3 className="text-lg font-semibold">{continueResource.title}</h3>
                {continueResource.description && (
                  <p className="text-sm text-muted-foreground">{continueResource.description}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{continueResource.progress || 0}% completed</span>
                  {continueResource.duration && (
                    <span className="text-muted-foreground">
                      {Math.round((continueResource.duration * (100 - (continueResource.progress || 0))) / 100)} min left
                    </span>
                  )}
                </div>
                <ProgressBar value={continueResource.progress || 0} />
              </div>
              
              <Button
                onClick={() => navigate(`/category/${continueResource.path_id}/resource/${continueResource.id}`)}
                className="rounded-full"
                size="sm"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      )}

      <CreateLearningPathDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default Index;
