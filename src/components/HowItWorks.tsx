import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserCheck, MessageSquare, DollarSign } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse verified professionals by skill, location, and ratings. Use advanced filters to find the perfect match for your project.",
    color: "text-primary"
  },
  {
    icon: UserCheck,
    title: "Verify & Connect",
    description: "All professionals are KYC-verified with TIN validation. Review portfolios, ratings, and connect with confidence.",
    color: "text-success"
  },
  {
    icon: MessageSquare,
    title: "Collaborate & Manage",
    description: "Real-time messaging, milestone tracking, and team formation. Manage your entire project from one dashboard.",
    color: "text-warning"
  },
  {
    icon: DollarSign,
    title: "Secure Payments",
    description: "Escrow-based milestone payments ensure security. Pay only when milestones are completed to your satisfaction.",
    color: "text-primary"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Simple Steps to Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From finding the right professional to project completion, SeekCa makes remote collaboration seamless and secure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-soft transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-subtle flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}