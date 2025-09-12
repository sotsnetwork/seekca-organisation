import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Remote Work: Trends and Predictions for 2024",
    excerpt: "Explore the latest trends shaping the remote work landscape and how businesses can adapt to stay competitive.",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    category: "Industry Insights",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "How to Build Trust in Virtual Teams",
    excerpt: "Practical strategies for fostering trust and collaboration in distributed teams across different time zones.",
    author: "Michael Chen",
    date: "March 10, 2024",
    category: "Team Management",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "The Complete Guide to Professional Verification",
    excerpt: "Understanding the importance of professional verification in the gig economy and how it protects both clients and freelancers.",
    author: "Emma Rodriguez",
    date: "March 5, 2024",
    category: "Security",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Scaling Your Business with Global Talent",
    excerpt: "Learn how businesses are successfully scaling operations by tapping into verified professional networks worldwide.",
    author: "David Kumar",
    date: "February 28, 2024",
    category: "Business Growth",
    readTime: "8 min read"
  },
  {
    id: 5,
    title: "Best Practices for Project Management in Remote Settings",
    excerpt: "Essential project management techniques and tools for successfully delivering projects with distributed teams.",
    author: "Lisa Park",
    date: "February 25, 2024",
    category: "Project Management",
    readTime: "9 min read"
  },
  {
    id: 6,
    title: "The Economics of Verification: Why It Matters",
    excerpt: "An in-depth analysis of how professional verification impacts marketplace economics and trust metrics.",
    author: "Robert Thompson",
    date: "February 20, 2024",
    category: "Economics",
    readTime: "4 min read"
  }
];

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

      {/* Featured Post */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Featured Article</h2>
            <p className="text-muted-foreground">Our latest insights on the evolving professional landscape</p>
          </div>
          
          <Card className="mb-16 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-gradient-subtle p-12 flex items-center justify-center">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-4xl font-heading font-bold text-primary-foreground">1</span>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4">{blogPosts[0].category}</Badge>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4">{blogPosts[0].title}</h3>
                <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{blogPosts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{blogPosts[0].date}</span>
                  </div>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <Button>
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Latest Articles</h2>
            <p className="text-muted-foreground">Stay updated with the latest trends and insights</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-subtle"></div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
            Stay Updated
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Subscribe to our newsletter for the latest insights on remote work, professional development, and industry trends.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-border rounded-md bg-background"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}