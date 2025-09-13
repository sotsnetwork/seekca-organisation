import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Star, 
  ThumbsUp, 
  Reply, 
  Search, 
  Filter,
  Plus,
  BookOpen,
  Lightbulb,
  Shield,
  Award,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

const communityStats = [
  { label: "Active Members", value: "12,847", icon: Users },
  { label: "Discussions", value: "3,421", icon: MessageSquare },
  { label: "Solutions", value: "8,932", icon: Lightbulb },
  { label: "Top Contributors", value: "156", icon: Award }
];

const featuredTopics = [
  {
    id: 1,
    title: "Best practices for pricing your services",
    author: "Sarah Johnson",
    authorAvatar: "SJ",
    category: "Business Tips",
    replies: 24,
    likes: 47,
    lastActivity: "2 hours ago",
    isPinned: true,
    tags: ["pricing", "business", "strategy"]
  },
  {
    id: 2,
    title: "How to build trust with new clients",
    author: "Mike Chen",
    authorAvatar: "MC",
    category: "Client Relations",
    replies: 18,
    likes: 32,
    lastActivity: "4 hours ago",
    isPinned: false,
    tags: ["trust", "clients", "communication"]
  },
  {
    id: 3,
    title: "Portfolio photography tips for professionals",
    author: "Lisa Rodriguez",
    authorAvatar: "LR",
    category: "Portfolio",
    replies: 31,
    likes: 58,
    lastActivity: "6 hours ago",
    isPinned: false,
    tags: ["photography", "portfolio", "marketing"]
  },
  {
    id: 4,
    title: "Handling difficult clients - share your experiences",
    author: "David Okafor",
    authorAvatar: "DO",
    category: "Client Relations",
    replies: 42,
    likes: 67,
    lastActivity: "8 hours ago",
    isPinned: false,
    tags: ["difficult-clients", "experience", "advice"]
  },
  {
    id: 5,
    title: "Tax tips for freelancers and contractors",
    author: "Emma Wilson",
    authorAvatar: "EW",
    category: "Finance",
    replies: 15,
    likes: 28,
    lastActivity: "1 day ago",
    isPinned: false,
    tags: ["taxes", "freelancing", "finance"]
  }
];

const categories = [
  { name: "All Topics", count: 3421, color: "bg-blue-500" },
  { name: "Business Tips", count: 892, color: "bg-green-500" },
  { name: "Client Relations", count: 567, color: "bg-purple-500" },
  { name: "Portfolio", count: 423, color: "bg-orange-500" },
  { name: "Finance", count: 234, color: "bg-red-500" },
  { name: "Technical Support", count: 189, color: "bg-gray-500" },
  { name: "Success Stories", count: 156, color: "bg-yellow-500" },
  { name: "General Discussion", count: 760, color: "bg-indigo-500" }
];

const topContributors = [
  {
    name: "Sarah Johnson",
    avatar: "SJ",
    points: 2847,
    badges: ["Expert", "Helper", "Mentor"],
    recentActivity: "2 hours ago"
  },
  {
    name: "Mike Chen",
    avatar: "MC",
    points: 2156,
    badges: ["Expert", "Helper"],
    recentActivity: "4 hours ago"
  },
  {
    name: "Lisa Rodriguez",
    avatar: "LR",
    points: 1923,
    badges: ["Helper", "Mentor"],
    recentActivity: "6 hours ago"
  },
  {
    name: "David Okafor",
    avatar: "DO",
    points: 1754,
    badges: ["Expert"],
    recentActivity: "8 hours ago"
  },
  {
    name: "Emma Wilson",
    avatar: "EW",
    points: 1632,
    badges: ["Helper"],
    recentActivity: "1 day ago"
  }
];

const recentDiscussions = [
  {
    id: 6,
    title: "What's the best way to handle project scope changes?",
    author: "Alex Thompson",
    authorAvatar: "AT",
    category: "Client Relations",
    replies: 12,
    likes: 19,
    lastActivity: "30 minutes ago"
  },
  {
    id: 7,
    title: "Recommended tools for project management",
    author: "Maria Garcia",
    authorAvatar: "MG",
    category: "Business Tips",
    replies: 8,
    likes: 15,
    lastActivity: "1 hour ago"
  },
  {
    id: 8,
    title: "How to market your services on social media",
    author: "James Wilson",
    authorAvatar: "JW",
    category: "Marketing",
    replies: 21,
    likes: 34,
    lastActivity: "2 hours ago"
  }
];

export default function Community() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");

  const filteredTopics = featuredTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Community
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect, learn, and grow with fellow professionals
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search discussions, topics, or members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 text-lg"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {communityStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base lg:text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 lg:space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between p-2 lg:p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 lg:gap-3 min-w-0">
                      <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full flex-shrink-0 ${category.color}`} />
                      <span className="font-medium text-sm lg:text-base truncate">{category.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card className="hidden lg:block">
              <CardHeader>
                <CardTitle className="text-base lg:text-lg">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                {topContributors.slice(0, 3).map((contributor, index) => (
                  <div key={index} className="flex items-center gap-2 lg:gap-3">
                    <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                      <AvatarFallback className="text-xs">
                        {contributor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-xs lg:text-sm truncate">{contributor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {contributor.points} points
                      </div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {contributor.badges.slice(0, 2).map((badge) => (
                          <Badge key={badge} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="discussions" className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <TabsList className="grid w-full sm:w-auto grid-cols-3">
                  <TabsTrigger value="discussions" className="text-xs md:text-sm">Discussions</TabsTrigger>
                  <TabsTrigger value="questions" className="text-xs md:text-sm">Questions</TabsTrigger>
                  <TabsTrigger value="announcements" className="text-xs md:text-sm">News</TabsTrigger>
                </TabsList>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">New Post</span>
                  <span className="sm:hidden">Post</span>
                </Button>
              </div>

              <TabsContent value="discussions" className="space-y-4">
                {filteredTopics.map((topic) => (
                  <Card key={topic.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="text-xs">
                            {topic.authorAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg mb-1">
                                {topic.title}
                                {topic.isPinned && (
                                  <Badge variant="secondary" className="ml-2">
                                    Pinned
                                  </Badge>
                                )}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>by {topic.author}</span>
                                <Badge variant="outline">{topic.category}</Badge>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {topic.lastActivity}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Reply className="w-3 h-3" />
                              {topic.replies} replies
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {topic.likes} likes
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {topic.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="questions" className="space-y-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Questions & Answers</h3>
                    <p className="text-muted-foreground mb-4">
                      Ask questions and get answers from the community
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Ask a Question
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="announcements" className="space-y-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Announcements</h3>
                    <p className="text-muted-foreground mb-4">
                      Stay updated with the latest SeekCa news and updates
                    </p>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View All Announcements
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
