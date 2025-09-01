import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Globe, 
  MessageSquare, 
  CreditCard, 
  Users, 
  Clock,
  FileText,
  Star
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "KYC Verification",
    description: "All professionals undergo rigorous KYC verification with TIN validation and document verification.",
    highlight: true
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Access professionals from 50+ countries. Find local expertise for your remote projects anywhere.",
    highlight: false
  },
  {
    icon: MessageSquare,
    title: "Real-time Collaboration",
    description: "Built-in messaging, file sharing, and team formation tools for seamless project management.",
    highlight: false
  },
  {
    icon: CreditCard,
    title: "Secure Escrow Payments",
    description: "Milestone-based payments with escrow protection. Pay only when work is completed satisfactorily.",
    highlight: true
  },
  {
    icon: Users,
    title: "Team Formation",
    description: "Build multi-disciplinary teams for complex projects. Invite and manage team members effortlessly.",
    highlight: false
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Built-in timesheet and milestone tracking. Monitor progress and manage deadlines effectively.",
    highlight: false
  },
  {
    icon: FileText,
    title: "Project Management",
    description: "Complete project lifecycle management with attachments, proposals, and milestone tracking.",
    highlight: false
  },
  {
    icon: Star,
    title: "Rating & Reviews",
    description: "Transparent rating system helps you choose the best professionals and build your reputation.",
    highlight: true
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive tools and features designed for professional remote collaboration and project success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-elegant transition-all duration-300 ${
                feature.highlight ? 'ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-transparent' : ''
              }`}
            >
              <CardHeader className="pb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  feature.highlight ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                }`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-heading font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}