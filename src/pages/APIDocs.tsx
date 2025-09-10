import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, BookOpen, Key, Zap, Shield, Globe, Database, Users, MessageSquare, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import ProfileNavigation from "@/components/ProfileNavigation";
import { useAuth } from "@/hooks/use-auth";

const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/v1/professionals",
    description: "Get list of professionals",
    parameters: [
      { name: "location", type: "string", required: false, description: "Filter by location" },
      { name: "skills", type: "array", required: false, description: "Filter by skills" },
      { name: "min_rate", type: "number", required: false, description: "Minimum hourly rate" },
      { name: "max_rate", type: "number", required: false, description: "Maximum hourly rate" },
      { name: "page", type: "number", required: false, description: "Page number" },
      { name: "limit", type: "number", required: false, description: "Results per page" }
    ]
  },
  {
    method: "GET",
    endpoint: "/api/v1/professionals/{id}",
    description: "Get professional details",
    parameters: [
      { name: "id", type: "string", required: true, description: "Professional ID" }
    ]
  },
  {
    method: "POST",
    endpoint: "/api/v1/jobs",
    description: "Create a new job posting",
    parameters: [
      { name: "title", type: "string", required: true, description: "Job title" },
      { name: "description", type: "string", required: true, description: "Job description" },
      { name: "location", type: "string", required: true, description: "Job location" },
      { name: "budget", type: "number", required: true, description: "Project budget" },
      { name: "skills_required", type: "array", required: true, description: "Required skills" },
      { name: "deadline", type: "string", required: false, description: "Project deadline" }
    ]
  },
  {
    method: "GET",
    endpoint: "/api/v1/jobs",
    description: "Get list of job postings",
    parameters: [
      { name: "status", type: "string", required: false, description: "Filter by status" },
      { name: "location", type: "string", required: false, description: "Filter by location" },
      { name: "category", type: "string", required: false, description: "Filter by category" }
    ]
  },
  {
    method: "POST",
    endpoint: "/api/v1/messages",
    description: "Send a message",
    parameters: [
      { name: "recipient_id", type: "string", required: true, description: "Recipient user ID" },
      { name: "subject", type: "string", required: true, description: "Message subject" },
      { name: "content", type: "string", required: true, description: "Message content" },
      { name: "job_id", type: "string", required: false, description: "Related job ID" }
    ]
  },
  {
    method: "GET",
    endpoint: "/api/v1/messages",
    description: "Get user messages",
    parameters: [
      { name: "conversation_id", type: "string", required: false, description: "Filter by conversation" },
      { name: "unread_only", type: "boolean", required: false, description: "Show only unread messages" }
    ]
  }
];

const codeExamples = {
  javascript: `// Get professionals in Lagos with specific skills
const response = await fetch('https://api.seekca.com/v1/professionals?location=Lagos&skills=plumbing,electrical', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const professionals = await response.json();
console.log(professionals);`,
  
  python: `import requests

# Get professionals in Lagos with specific skills
headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

params = {
    'location': 'Lagos',
    'skills': 'plumbing,electrical'
}

response = requests.get('https://api.seekca.com/v1/professionals', 
                       headers=headers, params=params)
professionals = response.json()
print(professionals)`,
  
  php: `<?php
// Get professionals in Lagos with specific skills
$headers = [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
];

$params = http_build_query([
    'location' => 'Lagos',
    'skills' => 'plumbing,electrical'
]);

$response = file_get_contents('https://api.seekca.com/v1/professionals?' . $params, 
                             false, stream_context_create([
    'http' => ['header' => $headers]
]));

$professionals = json_decode($response, true);
print_r($professionals);
?>`
};

const sdkFeatures = [
  {
    title: "Authentication",
    description: "Secure API key management and OAuth integration",
    icon: Key
  },
  {
    title: "Real-time Updates",
    description: "WebSocket support for live notifications and messages",
    icon: Zap
  },
  {
    title: "File Upload",
    description: "Upload portfolio images and project documents",
    icon: Database
  },
  {
    title: "Search & Filter",
    description: "Advanced search capabilities with multiple filters",
    icon: Globe
  },
  {
    title: "Messaging",
    description: "Send and receive messages between users",
    icon: MessageSquare
  },
  {
    title: "Job Management",
    description: "Create, update, and manage job postings",
    icon: Briefcase
  }
];

export default function APIDocs() {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  return (
    <div className="min-h-screen bg-background">
      {user && <ProfileNavigation />}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Build powerful integrations with SeekCa's REST API
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Reliable
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Real-time Updates
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              Global Coverage
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="endpoints" className="text-xs md:text-sm">Endpoints</TabsTrigger>
            <TabsTrigger value="examples" className="text-xs md:text-sm">Examples</TabsTrigger>
            <TabsTrigger value="sdks" className="text-xs md:text-sm">SDKs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The SeekCa API allows you to integrate our marketplace functionality into your own applications. 
                  Whether you're building a mobile app, website, or third-party service, our API provides access to 
                  professionals, job postings, messaging, and more.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Base URL</h3>
                    <code className="bg-muted px-3 py-2 rounded text-xs md:text-sm block break-all">
                      https://api.seekca.com/v1
                    </code>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Authentication</h3>
                    <code className="bg-muted px-3 py-2 rounded text-xs md:text-sm block">
                      Bearer Token
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Rate Limits</h3>
                  <p className="text-muted-foreground text-sm">
                    Free tier: 1,000 requests per hour<br />
                    Pro tier: 10,000 requests per hour<br />
                    Enterprise: Custom limits
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SDK Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {sdkFeatures.map((feature) => (
                    <div key={feature.title} className="flex items-start gap-3 p-3 md:p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs md:text-sm">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints" className="space-y-6">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={endpoint.method === "GET" ? "default" : "secondary"}
                      className="px-3 py-1"
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono">{endpoint.endpoint}</code>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {endpoint.parameters.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Parameters</h4>
                      <div className="space-y-2">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <div key={paramIndex} className="flex items-start gap-4 p-3 bg-muted/50 rounded">
                            <div className="flex items-center gap-2 min-w-0">
                              <code className="text-sm font-mono">{param.name}</code>
                              <Badge variant="outline" className="text-xs">
                                {param.type}
                              </Badge>
                              {param.required && (
                                <Badge variant="destructive" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Code Examples Tab */}
          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>
                  Choose your preferred programming language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  {Object.keys(codeExamples).map((lang) => (
                    <Button
                      key={lang}
                      variant={selectedLanguage === lang ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </Button>
                  ))}
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    <code>{codeExamples[selectedLanguage as keyof typeof codeExamples]}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SDKs Tab */}
          <TabsContent value="sdks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Official SDKs</CardTitle>
                <CardDescription>
                  Use our official SDKs for faster integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">JavaScript/Node.js</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <code className="text-sm">npm install @seekca/sdk</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Full-featured SDK for web and Node.js applications
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Python</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <code className="text-sm">pip install seekca-sdk</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Python SDK for backend services and data analysis
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">PHP</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <code className="text-sm">composer require seekca/sdk</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      PHP SDK for web applications and WordPress plugins
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Mobile SDKs</h3>
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded">
                        <code className="text-sm">iOS: CocoaPods</code>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <code className="text-sm">Android: Gradle</code>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Native mobile SDKs for iOS and Android
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Get your API key to start building
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    To get started with the SeekCa API, you'll need an API key. 
                    Sign up for a developer account to get your free API key.
                  </p>
                  <div className="flex gap-4">
                    <Button>
                      <Key className="w-4 h-4 mr-2" />
                      Get API Key
                    </Button>
                    <Button variant="outline">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
