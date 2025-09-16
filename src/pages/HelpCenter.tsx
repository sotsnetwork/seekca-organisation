import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, Mail, Phone, Clock, BookOpen, Users, Shield, CreditCard, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    faqs: [
      {
        question: "How do I create an account on SeekCa?",
        answer: "Creating an account is easy! Click the 'Get Started' button on our homepage, choose whether you're a professional or looking to hire, and follow the simple registration process. You'll need to verify your email address and complete your profile."
      },
      {
        question: "What's the difference between a Professional and Business account?",
        answer: "A Professional account is for individuals offering services (contractors, cleaners, landscapers, etc.). A Business account is for companies or individuals looking to hire professionals for their projects. Both account types can browse and connect with each other."
      },
      {
        question: "How do I verify my account?",
        answer: "Account verification helps build trust in our community. We'll guide you through the process which may include email verification, phone verification, and in some cases, document verification depending on your location and services offered."
      },
      {
        question: "Can I change my account type later?",
        answer: "Yes! You can switch between Professional and Business accounts at any time in your profile settings. However, you'll need to complete the appropriate verification process for your new account type."
      }
    ]
  },
  {
    id: "for-professionals",
    title: "For Professionals",
    icon: Users,
    faqs: [
      {
        question: "How do I set up my professional profile?",
        answer: "Complete your profile by adding your skills, location, hourly rate, and portfolio. Upload photos of your work, add client testimonials, and keep your availability updated. A complete profile gets 3x more job requests!"
      },
      {
        question: "How do I get paid for completed work?",
        answer: "SeekCa handles payments securely through our platform. When a job is completed and approved by the client, funds are automatically transferred to your account. You can withdraw to your bank account or digital wallet."
      },
      {
        question: "What fees does SeekCa charge?",
        answer: "SeekCa is completely free for both hirers and professionals! No platform fees, no service charges, no hidden costs. We believe in connecting talent with opportunity without barriers."
      },
      {
        question: "How do I handle disputes with clients?",
        answer: "If you encounter issues with a client, contact our support team immediately. We have a dispute resolution process that's fair to both parties. Most disputes are resolved within 48 hours."
      },
      {
        question: "Can I work with clients outside my area?",
        answer: "Yes! While many jobs are local, you can also work on remote projects like consultations, design work, or virtual services. Make sure to clearly indicate your service areas in your profile."
      }
    ]
  },
  {
    id: "for-businesses",
    title: "For Businesses",
    icon: Shield,
    faqs: [
      {
        question: "How do I find the right professional for my project?",
        answer: "Use our search filters to find professionals by location, skills, hourly rate, and ratings. Read profiles, check portfolios, and review client feedback. You can also post a job and let professionals come to you."
      },
      {
        question: "How do I post a job?",
        answer: "Click 'Post Job' in your dashboard, fill out the project details including description, budget, timeline, and required skills. Professionals will see your job and can submit proposals with their rates and approach."
      },
      {
        question: "How do payments work?",
        answer: "Payments are held securely in escrow until work is completed to your satisfaction. You can pay by credit card, bank transfer, or digital wallet. Funds are only released when you approve the completed work."
      },
      {
        question: "What if I'm not satisfied with the work?",
        answer: "Contact the professional first to discuss any issues. If you can't resolve it, contact our support team. We offer a satisfaction guarantee and will work with you to find a solution or provide a refund."
      },
      {
        question: "Can I hire the same professional for multiple projects?",
        answer: "Absolutely! Many of our clients build long-term relationships with trusted professionals. You can save favorite professionals and easily rehire them for future projects."
      }
    ]
  },
  {
    id: "payments",
    title: "Payments & Billing",
    icon: CreditCard,
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, PayPal, and various digital wallets. Payment methods may vary by country."
      },
      {
        question: "When do professionals get paid?",
        answer: "Professionals receive payment within 1-2 business days after job completion and client approval. Payment processing times may vary depending on the withdrawal method chosen."
      },
      {
        question: "Are there any hidden fees?",
        answer: "Absolutely no hidden fees! SeekCa is completely free for both hirers and professionals. No platform fees, no service charges, no hidden costs. What you see is what you get."
      },
      {
        question: "Can I get a refund?",
        answer: "Yes, we offer refunds in certain circumstances. If work doesn't meet the agreed standards or if there's a valid dispute, we'll work with you to resolve the issue or provide a refund."
      }
    ]
  },
  {
    id: "technical",
    title: "Technical Support",
    icon: Settings,
    faqs: [
      {
        question: "The app is running slowly. What should I do?",
        answer: "Try refreshing the page, clearing your browser cache, or updating to the latest version of your browser. If issues persist, contact our technical support team."
      },
      {
        question: "I can't upload photos to my portfolio. Help!",
        answer: "Make sure your images are in JPG, PNG, or WebP format and under 10MB each. If you're still having issues, try using a different browser or contact support."
      },
      {
        question: "How do I change my password?",
        answer: "Go to Settings > Account Security > Change Password. You'll need to enter your current password and create a new one. Make sure it's strong and unique."
      },
      {
        question: "I'm not receiving email notifications. What's wrong?",
        answer: "Check your spam folder first. If emails aren't there, go to Settings > Notifications and make sure email notifications are enabled. You can also add our email to your contacts."
      }
    ]
  }
];

const supportOptions = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    available: true,
    responseTime: "Usually within 5 minutes"
  },
  {
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    available: true,
    responseTime: "Within 24 hours"
  },
  {
    title: "Phone Support",
    description: "Speak directly with our team",
    icon: Phone,
    available: true,
    responseTime: "Mon-Fri, 9AM-6PM EST"
  }
];

export default function HelpCenter() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Help Center
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to your questions and get the support you need
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg"
            />
          </div>
        </div>

        {/* Quick Support Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {supportOptions.map((option) => (
            <Card key={option.title} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 md:p-6 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <option.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2">{option.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground mb-3">{option.description}</p>
                <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground mb-3">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{option.responseTime}</span>
                </div>
                <Button className="w-full text-sm md:text-base" disabled={!option.available}>
                  {option.available ? "Get Help" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQs.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{category.title}</CardTitle>
                    <CardDescription>
                      {category.faqs.length} article{category.faqs.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-12 bg-gradient-hero border-0">
          <CardContent className="p-6 md:p-8 text-center text-primary-foreground">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Still need help?</h2>
            <p className="text-sm md:text-base text-primary-foreground/90 mb-4 md:mb-6">
              Our support team is here to help you succeed on SeekCa
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Send Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
