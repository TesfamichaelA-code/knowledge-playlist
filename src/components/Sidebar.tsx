
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Home, BookOpen, Search, PlusCircle, LogOut, User, Layers, Loader2, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { fetchLearningPaths } from '@/services/learningPathService';
import CreateLearningPathDialog from '@/components/CreateLearningPathDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ['learningPaths'],
    queryFn: fetchLearningPaths,
  });

  // Close mobile sidebar on navigation
  const handleNavClick = () => {
    if (isMobile) setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {(!collapsed || isMobile) && (
          <Link to="/dashboard" className="flex items-center gap-2" onClick={handleNavClick}>
            <Layers className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">LearnPath</span>
          </Link>
        )}
        {collapsed && !isMobile && <Layers className="h-6 w-6 mx-auto text-primary" />}
        {isMobile ? (
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-full hover:bg-sidebar-accent hover:text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-sidebar-accent hover:text-primary transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
        <nav className="px-2 space-y-1">
          <Link 
            to="/dashboard"
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              location.pathname === "/dashboard" 
                ? "bg-sidebar-accent text-primary" 
                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <Home className="h-5 w-5" />
            {(!collapsed || isMobile) && <span>Home</span>}
          </Link>
          
          <Link 
            to="/search"
            onClick={handleNavClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              location.pathname === "/search" 
                ? "bg-sidebar-accent text-primary" 
                : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
          >
            <Search className="h-5 w-5" />
            {(!collapsed || isMobile) && <span>Search</span>}
          </Link>
          
          {(!collapsed || isMobile) && (
            <div className="mt-6 px-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                  Learning Paths
                </h3>
                <button 
                  className="p-1 rounded-full hover:bg-sidebar-accent/50 hover:text-primary transition-colors"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : learningPaths && learningPaths.length > 0 ? (
                  learningPaths.map((path) => (
                    <Link
                      key={path.id}
                      to={`/category/${path.id}`}
                      onClick={handleNavClick}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-sm",
                        location.pathname === `/category/${path.id}` 
                          ? "bg-sidebar-accent text-primary" 
                          : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <BookOpen className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{path.title}</span>
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-1 px-2">
                    No learning paths yet
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        {(!collapsed || isMobile) && user && (
          <div className="flex items-center gap-2 px-3 py-2">
            <User className="h-5 w-5" />
            <div className="truncate text-sm">
              {user.email}
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { signOut(); handleNavClick(); }}
          className={cn(
            "w-full flex items-center gap-3",
            collapsed && !isMobile ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-5 w-5" />
          {(!collapsed || isMobile) && <span>Sign out</span>}
        </Button>
      </div>
    </>
  );

  // Mobile: hamburger button + overlay drawer
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-sidebar text-sidebar-foreground border border-sidebar-border shadow-lg"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[280px] bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>

        <CreateLearningPathDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
        />
      </>
    );
  }

  // Desktop: standard collapsible sidebar
  return (
    <div 
      className={cn(
        "sidebar h-screen sticky top-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {sidebarContent}

      <CreateLearningPathDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
