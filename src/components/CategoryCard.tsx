
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';
import { LearningPathWithStats } from '@/types';
import { ProgressBar } from './ProgressBar';

interface CategoryCardProps {
  category: LearningPathWithStats;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const progressPercentage = category.totalResources > 0 
    ? Math.round((category.completedResources / category.totalResources) * 100) 
    : 0;

  const totalHours = Math.floor(category.totalDuration / 60);
  const remainingMinutes = category.totalDuration % 60;
  
  const formattedTime = category.totalDuration === 0
    ? 'N/A'
    : totalHours > 0
      ? `${totalHours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`
      : `${remainingMinutes}m`;

  return (
    <Link 
      to={`/category/${category.id}`}
      className="group glass-card rounded-lg overflow-hidden hover-scale"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="inline-block bg-primary/20 text-primary text-xs font-medium px-2 py-0.5 rounded-full mb-2">
            {category.category}
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
            {category.title}
          </h3>
          {category.description && (
            <p className="text-sm text-white/70 line-clamp-2 mt-1">
              {category.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{category.totalResources} resource{category.totalResources !== 1 ? 's' : ''}</span>
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
