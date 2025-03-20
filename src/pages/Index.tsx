
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CategoryCard from '@/components/CategoryCard';
import SearchBar from '@/components/SearchBar';
import { Layers, Loader2 } from 'lucide-react';
import { fetchLearningPaths } from '@/services/learningPathService';
import CreateLearningPathDialog from '@/components/CreateLearningPathDialog';

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: learningPaths, isLoading, error } = useQuery({
    queryKey: ['learningPaths'],
    queryFn: fetchLearningPaths,
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
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome to LearnPath</h1>
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
                category={{
                  id: path.id,
                  title: path.title,
                  description: path.description || "",
                  thumbnail: "", // Changed from image to thumbnail
                  resources: [],
                  totalResources: 0, 
                  completedResources: 0
                }} 
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
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Continue Learning</h2>
        
        <div className="glass-card rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="aspect-video md:w-1/3 rounded-lg overflow-hidden">
            <img 
              src="https://img.youtube.com/vi/Hf4MJH0jDb4/maxresdefault.jpg" 
              alt="React Native Crash Course"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="md:w-2/3 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">React Native Crash Course</h3>
              <p className="text-sm text-muted-foreground">Learn the basics of React Native in this crash course</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">30% completed</span>
                <span className="text-muted-foreground">40 minutes left</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[30%] rounded-full" />
              </div>
            </div>
            
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors">
              Continue Learning
            </button>
          </div>
        </div>
      </div>

      <CreateLearningPathDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default Index;
