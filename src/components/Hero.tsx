import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import { useAuth } from "@/hooks/use-auth";
import UserProfileDropdown from "./UserProfileDropdown";

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen bg-gradient-subtle overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={logoIcon} alt="SeekCa" className="w-8 h-8" />
          <span className="text-2xl font-heading font-bold text-foreground">SeekCa</span>
        </div>
        
                 {/* Desktop Navigation */}
         <div className="hidden md:flex items-center gap-6">
           <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors">How it Works</a>
           <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors">Features</a>
           <a href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors">Pricing</a>
           
           {user ? (
             <UserProfileDropdown />
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

                 {/* Mobile Navigation */}
         <div className="md:hidden flex items-center gap-3">
           {user ? (
             <UserProfileDropdown />
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
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Verified Professionals Only
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 leading-tight">
              {user ? (
                <>
                  Welcome back,
                  <span className="block bg-gradient-hero bg-clip-text text-transparent">
                    {user.user_metadata?.full_name || 'Professional'}
                  </span>
                </>
              ) : (
                <>
                  Find & Hire
                  <span className="block bg-gradient-hero bg-clip-text text-transparent">
                    Verified Pros
                  </span>
                  Near You
                </>
              )}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              {user 
                ? "Ready to continue your journey? Explore new opportunities or manage your existing projects."
                : "Connect with KYC-verified professionals worldwide. Run physical projects remotely with secure payments, milestone tracking, and real-time collaboration."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              {user ? (
                <>
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                    View Dashboard
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Browse Projects
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6" asChild>
                    <Link to="/auth">Find Professionals</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
                    <Link to="/auth">Join as Professional</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span>KYC Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-success" />
                <span>Global Network</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-success" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Right Content - Image with shadow */}
          <div className="relative">
            <img
              src="/Seekca%20prof%20images.png"
              alt="SeekCa Professionals"
              className="w-full md:w-[520px] lg:w-[640px] xl:w-[740px] max-w-none h-auto rounded-2xl border border-border/50 shadow-elegant"
            />
            <div className="pointer-events-none absolute -bottom-6 left-10 right-10 h-10 rounded-full bg-foreground/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}