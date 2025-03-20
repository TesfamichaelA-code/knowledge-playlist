
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  className?: string;
  showAnimation?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  className,
  showAnimation = true
}) => {
  // Ensure value is between 0 and 100
  const safeValue = Math.max(0, Math.min(100, value));
  
  return (
    <div className={cn("h-1.5 w-full bg-secondary rounded-full overflow-hidden", className)}>
      <div 
        className={cn(
          "h-full bg-primary rounded-full", 
          showAnimation && "transition-all duration-500"
        )}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};
