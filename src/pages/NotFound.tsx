
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="page-container min-h-[80vh] flex items-center justify-center">
      <div className="glass-card rounded-lg p-10 text-center max-w-md">
        <div className="mx-auto bg-secondary/50 h-20 w-20 rounded-full flex items-center justify-center mb-6">
          <FileQuestion className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <Link 
          to="/dashboard" 
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
