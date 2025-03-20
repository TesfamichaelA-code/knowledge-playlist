
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';
import { Category } from '@/utils/data';
import { ProgressBar } from './ProgressBar';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const progressPercentage = category.totalResources > 0 
    ? Math.round((category.completedResources / category.totalResources) * 100) 
    : 0;

  // Calculate total time in hours
  const totalTimeInMinutes = category.resources.reduce((acc, resource) => acc + resource.duration, 0);
  const totalHours = Math.floor(totalTimeInMinutes / 60);
  const remainingMinutes = totalTimeInMinutes % 60;
  
  const formattedTime = totalHours > 0
    ? `${totalHours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`
    : `${remainingMinutes}m`;

  return (
    <Link 
      to={`/category/${category.id}`}
      className="group glass-card rounded-lg overflow-hidden hover-scale"
    >
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={category.thumbnail} 
          alt={category.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
            {category.title}
          </h3>
          <p className="text-sm text-white/70 line-clamp-2">
            {category.description}
          </p>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{category.totalResources} resources</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formattedTime}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span>Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <ProgressBar value={progressPercentage} />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
