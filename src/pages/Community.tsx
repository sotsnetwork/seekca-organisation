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
  { label: "Active Members", value: "0", icon: Users },
  { label: "Discussions", value: "0", icon: MessageSquare },
  { label: "Solutions", value: "0", icon: Lightbulb },
  { label: "Top Contributors", value: "0", icon: Award }
];

const featuredTopics = [];

const categories = [
  { name: "All Topics", count: 0, color: "bg-blue-500" }
];

const topContributors = [];

const recentDiscussions = [];

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
                {topContributors.length > 0 ? (
                  topContributors.slice(0, 3).map((contributor, index) => (
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
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Award className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No contributors yet</p>
                  </div>
                )}
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
                {filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
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
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Be the first to start a discussion in the community
                      </p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Start a Discussion
                      </Button>
                    </CardContent>
                  </Card>
                )}
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
