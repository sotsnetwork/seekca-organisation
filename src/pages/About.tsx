import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Globe, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoIcon} alt="SeekCa" className="w-8 h-8" />
              <span className="text-2xl font-heading font-bold text-foreground">SeekCa</span>
            </Link>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground mb-6">
            About SeekCa
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            We're building the world's most trusted marketplace for verified professionals, 
            connecting businesses with skilled experts across the globe.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                SeekCa bridges the gap between businesses needing expertise and professionals 
                seeking opportunities. We believe that talent knows no borders, and the best 
                work happens when the right people connect.
              </p>
              <p className="text-lg text-muted-foreground">
                Through rigorous verification processes and cutting-edge technology, we ensure 
                that every collaboration on our platform is secure, professional, and successful.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">10,000+</h3>
                <p className="text-muted-foreground">Verified Professionals</p>
              </Card>
              <Card className="p-6 text-center">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">50+</h3>
                <p className="text-muted-foreground">Countries Served</p>
              </Card>
              <Card className="p-6 text-center">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">99.9%</h3>
                <p className="text-muted-foreground">Security Uptime</p>
              </Card>
              <Card className="p-6 text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-heading font-bold text-foreground mb-2">4.9/5</h3>
                <p className="text-muted-foreground">Average Rating</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and every decision we make.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-4">Trust & Security</h3>
                <p className="text-muted-foreground">
                  Every professional is thoroughly verified, and every transaction is secured 
                  with industry-leading encryption and payment protection.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-4">Global Collaboration</h3>
                <p className="text-muted-foreground">
                  We connect talent across continents, enabling businesses to access 
                  the best professionals regardless of geographical boundaries.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="w-16 h-16 text-primary mx-auto mb-6" />
                <h3 className="text-xl font-heading font-semibold text-foreground mb-4">Excellence</h3>
                <p className="text-muted-foreground">
                  We maintain the highest standards for quality, ensuring that every 
                  project delivered exceeds expectations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Whether you're a business looking for expertise or a professional seeking opportunities, 
            SeekCa is your gateway to global collaboration.
          </p>
          <Button size="lg" asChild>
            <Link to="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}