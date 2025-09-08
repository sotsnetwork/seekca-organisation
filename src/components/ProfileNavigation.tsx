import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { User, Briefcase, MessageSquare, Settings, Home } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import NotificationBell from "./NotificationBell";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileNavigation() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/profile", label: "Profile", icon: User },
    { path: "/portfolio", label: "Portfolio", icon: Briefcase },
    { path: "/messages", label: "Messages", icon: MessageSquare },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Home Link */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={logoIcon} alt="SeekCa" className="w-8 h-8" />
              <span className="text-xl font-heading font-bold text-foreground">SeekCa</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={isActive ? "bg-primary text-primary-foreground" : ""}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              );
            })}
            {user && <NotificationBell />}
          </div>
        </div>
      </div>
    </nav>
  );
}
