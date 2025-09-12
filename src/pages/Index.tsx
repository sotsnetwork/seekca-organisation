import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Professionals from "@/components/Professionals";
import Jobs from "@/components/Jobs";

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
          <Jobs />
          <Footer />
        </div>
      );
    }
    
    // Show professionals list for hirers
    if (userRole === 'hirer') {
      return (
        <div className="min-h-screen">
          <Professionals />
          <Footer />
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
