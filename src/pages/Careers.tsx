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
    title: "Senior Operations Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $120k",
    description: "Join our operations team to help manage and grow our professional services marketplace. You'll work on process improvement, vendor relations, and quality assurance.",
    requirements: ["5+ years operations experience", "Marketplace/platform experience", "Remote work experience"]
  },
  {
    id: 2,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote / New York",
    type: "Full-time",
    salary: "$70k - $100k",
    description: "Lead customer success initiatives for our professional services platform. Work closely with both professionals and clients to ensure satisfaction.",
    requirements: ["3+ years customer success", "Professional services experience", "Strong communication skills"]
  },
  {
    id: 3,
    title: "Quality Assurance Specialist",
    department: "Quality",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $85k",
    description: "Ensure quality standards for all professionals on our platform. Review credentials, conduct background checks, and maintain service standards.",
    requirements: ["Background check experience", "Quality assurance knowledge", "Attention to detail"]
  },
  {
    id: 4,
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    salary: "$50k - $70k",
    description: "Help promote our professional services marketplace and connect skilled workers with clients who need their services.",
    requirements: ["2+ years marketing experience", "Digital marketing knowledge", "Professional services experience"]
  },
  {
    id: 5,
    title: "Business Development Representative",
    department: "Business Development",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $80k",
    description: "Help grow our platform by connecting with professional service providers and building partnerships.",
    requirements: ["2+ years business development", "Professional services experience", "Excellent communication"]
  },
  {
    id: 6,
    title: "Compliance Specialist",
    department: "Compliance",
    location: "Remote",
    type: "Full-time",
    salary: "$70k - $90k",
    description: "Ensure our platform meets all regulatory requirements and maintains high standards for professional services.",
    requirements: ["Compliance certification", "Regulatory knowledge", "Professional services experience"]
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