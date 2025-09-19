import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import NotificationBell from "@/components/NotificationBell";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import logoIcon from "@/assets/logo-icon.png";
import { useUserRole } from "@/hooks/use-user-role";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function AppHeader() {
  const { user } = useAuth();
  const { data: userRole } = useUserRole();

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoIcon} alt="SeekCa" className="w-8 h-8" />
            <span className="text-xl sm:text-2xl font-heading font-bold text-foreground">SeekCa</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
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
                {userRole === 'professional' && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/teams-management">My Teams</Link>
                  </Button>
                )}
                {userRole === 'hirer' && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/teams">Browse Teams</Link>
                  </Button>
                )}
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

          {/* Mobile nav */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  {user ? (
                    <>
                      {userRole === 'hirer' && (
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link to="/post-job">Post a Job</Link>
                        </Button>
                      )}
                      {userRole === 'professional' && (
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link to="/">Browse Jobs</Link>
                        </Button>
                      )}
                      {userRole === 'professional' && (
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link to="/teams-management">My Teams</Link>
                        </Button>
                      )}
                      {userRole === 'hirer' && (
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link to="/teams">Browse Teams</Link>
                        </Button>
                      )}
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/community">Community</Link>
                      </Button>
                      <div className="pt-2 flex items-center gap-3">
                        <NotificationBell />
                        <UserProfileDropdown />
                      </div>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full justify-center" asChild>
                        <Link to="/auth">Sign In</Link>
                      </Button>
                      <Button className="w-full justify-center" asChild>
                        <Link to="/auth?tab=signup">Get Started</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}


