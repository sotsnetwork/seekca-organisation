import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "Join our engineering team to build the next generation of marketplace features. You'll work on React, TypeScript, and modern web technologies.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Remote work experience"]
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Remote / San Francisco",
    type: "Full-time",
    salary: "$140k - $180k",
    description: "Lead product strategy and execution for our core marketplace features. Work closely with engineering and design teams.",
    requirements: ["3+ years product management", "Marketplace experience", "Data-driven mindset"]
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$130k - $170k",
    description: "Build and maintain our cloud infrastructure, ensuring scalability and reliability for our global platform.",
    requirements: ["AWS/GCP experience", "Kubernetes knowledge", "CI/CD expertise"]
  },
  {
    id: 4,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    salary: "$110k - $140k",
    description: "Design intuitive user experiences for professionals and businesses using our platform worldwide.",
    requirements: ["4+ years UX design", "Figma proficiency", "Marketplace design experience"]
  },
  {
    id: 5,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $120k",
    description: "Help our customers succeed by providing exceptional support and building long-term relationships.",
    requirements: ["2+ years customer success", "B2B experience", "Excellent communication"]
  },
  {
    id: 6,
    title: "Security Engineer",
    department: "Security",
    location: "Remote",
    type: "Full-time",
    salary: "$150k - $190k",
    description: "Protect our platform and users by implementing robust security measures and monitoring systems.",
    requirements: ["Security certification", "Penetration testing", "Compliance experience"]
  }
];

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
              <span>50+ Team Members</span>
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

      {/* Job Openings */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our growing team and help shape the future of professional collaboration.
            </p>
          </div>
          
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">{job.department}</Badge>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <Button>Apply Now</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{job.description}</CardDescription>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Key Requirements:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Don't See Your Role?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We're always looking for talented individuals who share our vision. 
            Send us your resume and let's talk about how you can contribute to our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Send Resume</Button>
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