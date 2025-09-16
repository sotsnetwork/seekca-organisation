import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

const benefits = [
  {
    title: "Remote-First Culture",
    description: "Work from anywhere with flexible hours and async communication"
  },
  {
    title: "Competitive Compensation",
    description: "Market-rate salaries plus equity participation in company growth"
  },
  {
    title: "Health & Wellness",
    description: "Comprehensive health insurance and wellness stipend"
  },
  {
    title: "Learning & Development",
    description: "Annual learning budget and conference attendance support"
  },
  {
    title: "Unlimited PTO",
    description: "Take the time you need to rest and recharge"
  },
  {
    title: "Equipment Stipend",
    description: "Home office setup budget for your optimal work environment"
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            Help us build the future of work by connecting verified professionals with opportunities worldwide.
          </p>
          <div className="flex items-center justify-center gap-8 text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>2 Team Members</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>100% Remote</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Flexible Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Why Work at SeekCa?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in creating an environment where talented people can do their best work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* No Open Positions */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're a small, focused team building something great. Check back soon for opportunities!
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                No Open Positions
              </h3>
              <p className="text-muted-foreground mb-6">
                We're currently not hiring, but we're always interested in connecting with talented individuals 
                who share our vision for the future of work.
              </p>
              <p className="text-sm text-muted-foreground">
                As a small team of 2, we're focused on building and growing our platform. 
                We'll post new opportunities here when we're ready to expand our team.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Interested in Our Mission?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            While we're not actively hiring, we'd love to hear from talented individuals who share our vision. 
            Send us your information and we'll keep you in mind for future opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Send Your Information
            </Button>
            <Button size="lg" variant="outline">
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}