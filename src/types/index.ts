/**
 * Shared types used across the application.
 * These are the UI-layer types for components that need a normalized shape.
 * They map from Supabase `Tables<"resources">` / `Tables<"learning_paths">`.
 */

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'documentation' | 'pdf';
  url: string;
  thumbnail?: string;
  description: string;
  duration: number; // in minutes
  completed: boolean;
  progress: number; // 0-100
}

export interface LearningPathWithStats {
  id: string;
  title: string;
  description: string;
  category: string;
  totalResources: number;
  completedResources: number;
  totalDuration: number; // total minutes across all resources
}
