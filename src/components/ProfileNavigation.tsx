import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { User, Briefcase, MessageSquare, Settings } from "lucide-react";

export default function ProfileNavigation() {
  const location = useLocation();

  const navItems = [
    { path: "/profile", label: "Profile", icon: User },
    { path: "/portfolio", label: "Portfolio", icon: Briefcase },
    { path: "/messages", label: "Messages", icon: MessageSquare },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="bg-muted/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-1 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                asChild
                className={`${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"} transition-colors`}
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
