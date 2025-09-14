import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import NotificationBell from "@/components/NotificationBell";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import logoIcon from "@/assets/logo-icon.png";
import { useUserRole } from "@/hooks/use-user-role";

export default function AppHeader() {
  const { user } = useAuth();
  const { data: userRole } = useUserRole();

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoIcon} alt="SeekCa" className="w-8 h-8" />
            <span className="text-2xl font-heading font-bold text-foreground">SeekCa</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {userRole === 'hirer' && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/post-job">Post a Job</Link>
                  </Button>
                )}
                {userRole === 'professional' && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/">Browse Jobs</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/community">Community</Link>
                </Button>
                <NotificationBell />
                <UserProfileDropdown />
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/auth?tab=signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


