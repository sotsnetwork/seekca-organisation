import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function CTA() {
  const { user } = useAuth();

  // Determine button actions based on user authentication status
  const getBusinessButtonAction = () => {
    if (user) {
      // If user is logged in, they can post jobs
      return { to: "/post-job", text: "Post Your First Job" };
    } else {
      // If not logged in, redirect to signup
      return { to: "/auth?tab=signup", text: "Sign Up to Post Jobs" };
    }
  };

  const getProfessionalButtonAction = () => {
    if (user) {
      // If user is logged in, they can access professional features
      return { to: "/profile", text: "View Professional Profile" };
    } else {
      // If not logged in, redirect to signup
      return { to: "/auth?tab=signup", text: "Join as Professional" };
    }
  };

  const businessAction = getBusinessButtonAction();
  const professionalAction = getProfessionalButtonAction();

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Card className="bg-gradient-hero border-0 shadow-elegant relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 via-transparent to-primary/10" />
          
          <CardContent className="relative z-10 p-12 md:p-16 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground mb-6">
                Ready to Build Your Next Project?
              </h2>
              
              <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
                Join thousands of businesses and professionals already collaborating on SeekCa. Start your journey today.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
                  <Users className="w-8 h-8 text-primary-foreground mb-4 mx-auto" />
                  <h3 className="text-xl font-heading font-semibold text-primary-foreground mb-2">
                    For Businesses
                  </h3>
                  <p className="text-primary-foreground/80 mb-4">
                    Find verified professionals for your remote projects. Access global talent with local expertise.
                  </p>
                  <Button variant="secondary" size="lg" className="w-full" asChild>
                    <Link to={businessAction.to}>
                      {businessAction.text}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-background/10 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/20">
                  <Shield className="w-8 h-8 text-primary-foreground mb-4 mx-auto" />
                  <h3 className="text-xl font-heading font-semibold text-primary-foreground mb-2">
                    For Professionals
                  </h3>
                  <p className="text-primary-foreground/80 mb-4">
                    Get verified and access global opportunities. Build your reputation and grow your business.
                  </p>
                  <Button variant="secondary" size="lg" className="w-full" asChild>
                    <Link to={professionalAction.to}>
                      {professionalAction.text}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-8 text-primary-foreground/80 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}