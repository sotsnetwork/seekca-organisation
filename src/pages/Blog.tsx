import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground mb-6">
            SeekCa Blog
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Insights, trends, and best practices for the future of remote work and professional collaboration.
          </p>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-12 h-12 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Blog Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're working on creating valuable content about remote work, professional development, and industry insights. 
              Check back soon for our first articles!
            </p>
          </div>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Stay Updated</CardTitle>
              <CardDescription>
                Get notified when we publish new content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-border rounded-md bg-background"
                />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}