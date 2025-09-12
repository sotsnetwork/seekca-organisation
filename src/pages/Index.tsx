import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Professionals from "@/components/Professionals";
import Jobs from "@/components/Jobs";
import AppHeader from "@/components/AppHeader";

const Index = () => {
  const { user, loading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole();

  // Show loading state while checking authentication and user role
  if (loading || (user && roleLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in, show content based on their role
  if (user) {
    // Show job listings for professionals
    if (userRole === 'professional') {
      return (
        <div className="min-h-screen">
          <AppHeader />
          <Jobs />
          <Footer />
        </div>
      );
    }
    
    // Show professionals list for hirers
    if (userRole === 'hirer') {
      return (
        <div className="min-h-screen">
          <AppHeader />
          <Professionals />
          <Footer />
        </div>
      );
    }
    
    // If role is null (user doesn't have a role assigned), show role selection
    if (userRole === null && !roleLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
            <p className="text-muted-foreground mb-6">
              It looks like you don't have a role assigned yet. Please contact support or try signing up again.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.href = '/auth'}
                className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Go to Sign Up
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Fallback while role is being determined
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show regular landing page
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
