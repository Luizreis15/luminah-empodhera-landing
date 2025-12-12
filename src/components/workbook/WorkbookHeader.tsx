import { Link, useNavigate } from "react-router-dom";
import { LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkbookAuth } from "@/hooks/useWorkbook";

interface WorkbookHeaderProps {
  showNav?: boolean;
}

export function WorkbookHeader({ showNav = true }: WorkbookHeaderProps) {
  const { user, signOut } = useWorkbookAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/caderno');
  };

  return (
    <header className="bg-card border-b border-gold/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/caderno/dashboard" className="flex items-center gap-2">
            <span className="text-3xl font-display text-foreground font-medium tracking-wide">
              EMPODHERA
            </span>
          </Link>

          {/* Navigation */}
          {showNav && user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/caderno/dashboard" 
                className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
              >
                <BookOpen size={18} />
                <span>Caderno</span>
              </Link>
            </nav>
          )}

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/70 hidden sm:inline">
                {user.user_metadata?.name || user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-foreground/70 hover:text-primary"
              >
                <LogOut size={18} />
                <span className="ml-2 hidden sm:inline">Sair</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
