
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './contexts/AuthContext';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import CategoryDetails from "./pages/CategoryDetails";
import ResourceView from "./pages/ResourceView";
import Search from "./pages/Search";
import Sidebar from "./components/Sidebar";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Show nothing while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" />;
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
    <Routes>
      <Route path="/auth" element={<Auth />} />
      
      <Route path="/" element={
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
