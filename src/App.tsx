
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './contexts/AuthContext';
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "./components/Sidebar";

// Lazy-loaded pages for code splitting
const Landing = React.lazy(() => import("./pages/Landing"));
const Index = React.lazy(() => import("./pages/Index"));
const Auth = React.lazy(() => import("./pages/Auth"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const CategoryDetails = React.lazy(() => import("./pages/CategoryDetails"));
const ResourceView = React.lazy(() => import("./pages/ResourceView"));
const Search = React.lazy(() => import("./pages/Search"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Show nothing while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Layout with sidebar for authenticated routes
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-container">
        {children}
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Index />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/category/:categoryId" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <CategoryDetails />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/category/:categoryId/resource/:resourceId" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <ResourceView />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/search" element={
          <ProtectedRoute>
            <AuthenticatedLayout>
              <Search />
            </AuthenticatedLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
