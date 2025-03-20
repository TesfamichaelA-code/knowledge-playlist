
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

export interface Category {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // Using thumbnail instead of image
  resources: Resource[];
  totalResources: number;
  completedResources: number;
}

export const categories: Category[] = [
  {
    id: 'react-native',
    title: 'React Native',
    description: 'Learn to build mobile apps with React Native',
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    resources: [
      {
        id: 'rn-1',
        title: 'React Native Crash Course',
        type: 'video',
        url: 'https://www.youtube.com/embed/Hf4MJH0jDb4',
        thumbnail: 'https://img.youtube.com/vi/Hf4MJH0jDb4/maxresdefault.jpg',
        description: 'Learn the basics of React Native in this crash course',
        duration: 60,
        completed: false,
        progress: 30,
      },
      {
        id: 'rn-2',
        title: 'React Native Documentation',
        type: 'documentation',
        url: 'https://reactnative.dev/docs/getting-started',
        description: 'Official React Native documentation',
        duration: 120,
        completed: false,
        progress: 10,
      },
      {
        id: 'rn-3',
        title: 'Building a React Native App',
        type: 'article',
        url: 'https://www.smashingmagazine.com/2016/04/the-beauty-of-react-native-building-your-first-ios-app-with-javascript-part-1/',
        description: 'A comprehensive guide to building your first React Native app',
        duration: 45,
        completed: true,
        progress: 100,
      }
    ],
    totalResources: 3,
    completedResources: 1,
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    description: 'Explore AI concepts and applications',
    thumbnail: 'https://images.unsplash.com/photo-1677442135188-fcbe9a93bad4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    resources: [
      {
        id: 'ai-1',
        title: 'Introduction to Machine Learning',
        type: 'video',
        url: 'https://www.youtube.com/embed/Gv9_4yMHFhI',
        thumbnail: 'https://img.youtube.com/vi/Gv9_4yMHFhI/maxresdefault.jpg',
        description: 'A beginner-friendly introduction to machine learning concepts',
        duration: 90,
        completed: false,
        progress: 50,
      },
      {
        id: 'ai-2',
        title: 'Deep Learning Fundamentals',
        type: 'documentation',
        url: 'https://www.tensorflow.org/tutorials',
        description: 'TensorFlow tutorials for deep learning',
        duration: 180,
        completed: false,
        progress: 20,
      }
    ],
    totalResources: 2,
    completedResources: 0,
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security',
    description: 'Learn about security principles and practices',
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    resources: [
      {
        id: 'cs-1',
        title: 'Ethical Hacking Course',
        type: 'video',
        url: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
        thumbnail: 'https://img.youtube.com/vi/3Kq1MIfTWCE/maxresdefault.jpg',
        description: 'Learn ethical hacking and penetration testing',
        duration: 120,
        completed: true,
        progress: 100,
      },
      {
        id: 'cs-2',
        title: 'Web Security Basics',
        type: 'article',
        url: 'https://www.hacksplaining.com/lessons',
        description: 'Interactive lessons on web security vulnerabilities',
        duration: 60,
        completed: false,
        progress: 75,
      }
    ],
    totalResources: 2,
    completedResources: 1,
  },
  {
    id: 'webdev',
    title: 'Web Development',
    description: 'Master modern web development technologies',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    resources: [
      {
        id: 'web-1',
        title: 'Full Stack Web Development',
        type: 'video',
        url: 'https://www.youtube.com/embed/nu_pCVPKzTk',
        thumbnail: 'https://img.youtube.com/vi/nu_pCVPKzTk/maxresdefault.jpg',
        description: 'Learn full stack web development from scratch',
        duration: 240,
        completed: false,
        progress: 15,
      }
    ],
    totalResources: 1,
    completedResources: 0,
  }
];

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

export function getResource(categoryId: string, resourceId: string): Resource | undefined {
  const category = getCategory(categoryId);
  if (!category) return undefined;
  return category.resources.find(resource => resource.id === resourceId);
}

export function updateResourceProgress(categoryId: string, resourceId: string, progress: number): boolean {
  const category = getCategory(categoryId);
  if (!category) return false;
  
  const resource = category.resources.find(resource => resource.id === resourceId);
  if (!resource) return false;
  
  resource.progress = progress;
  
  if (progress === 100 && !resource.completed) {
    resource.completed = true;
    category.completedResources += 1;
  }
  
  return true;
}

export function toggleResourceCompletion(categoryId: string, resourceId: string, completed: boolean): boolean {
  const category = getCategory(categoryId);
  if (!category) return false;
  
  const resource = category.resources.find(resource => resource.id === resourceId);
  if (!resource) return false;
  
  if (!resource.completed && completed) {
    resource.completed = true;
    resource.progress = 100;
    category.completedResources += 1;
  } 
  else if (resource.completed && !completed) {
    resource.completed = false;
    category.completedResources -= 1;
  }
  
  return true;
}
