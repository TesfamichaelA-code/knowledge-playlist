
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CategoryCard from '@/components/CategoryCard';
import { fetchLearningPathsWithStats } from '@/services/learningPathService';
import type { LearningPathWithStats } from '@/types';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<LearningPathWithStats[]>([]);
  
  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ['learningPathsWithStats'],
    queryFn: fetchLearningPathsWithStats,
  });

  useEffect(() => {
    if (!learningPaths || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredPaths = learningPaths.filter(path => 
      path.title.toLowerCase().includes(query) ||
      path.category.toLowerCase().includes(query) ||
      (path.description && path.description.toLowerCase().includes(query))
    );

    setResults(filteredPaths);
  }, [searchQuery, learningPaths]);

  return (
    <div className="page-container space-y-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Search</h1>
      
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          type="text"
          placeholder="Search for learning paths, topics, or resources..."
          className="pl-10 py-6 text-lg bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : searchQuery.trim() && results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
        </div>
      ) : searchQuery.trim() ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Search Results ({results.length})</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((path) => (
              <CategoryCard 
                key={path.id} 
                category={path} 
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Enter a search term to find learning paths</p>
        </div>
      )}
    </div>
  );
};

export default Search;
