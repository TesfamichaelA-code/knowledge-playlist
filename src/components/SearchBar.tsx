
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  className, 
  placeholder = "Search resources..." 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center w-full",
        className
      )}
    >
      <div className="absolute left-3 text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-secondary/40 border-transparent focus:border-primary focus:ring-1 focus:ring-primary py-2 pl-10 pr-10 rounded-full text-sm transition-colors"
      />
      
      {query && (
        <button 
          type="button"
          onClick={handleClear}
          className="absolute right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
