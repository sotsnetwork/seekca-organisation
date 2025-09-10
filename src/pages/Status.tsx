import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Server, 
  Database, 
  Globe, 
  MessageSquare,
  Users,
  RefreshCw,
  TrendingUp,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import ProfileNavigation from "@/components/ProfileNavigation";
import { useAuth } from "@/hooks/use-auth";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  uptime: number;
  responseTime: number;
  lastIncident?: string;
  description: string;
}

interface Incident {
  id: string;
  title: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  description: string;
  startedAt: string;
  resolvedAt?: string;
  affectedServices: string[];
}

const services: ServiceStatus[] = [
  {
    name: "API",
    status: "operational",
    uptime: 99.9,
    responseTime: 120,
    description: "Core API endpoints and authentication"
  },
  {
    name: "Website",
    status: "operational",
    uptime: 99.8,
    responseTime: 85,
    description: "Main website and user interface"
  },
  {
    name: "Database",
    status: "operational",
    uptime: 99.95,
    responseTime: 45,
    description: "Primary database and data storage"
  },
  {
    name: "Messaging",
    status: "operational",
    uptime: 99.7,
    responseTime: 200,
    description: "Real-time messaging and notifications"
  },
  {
    name: "File Storage",
    status: "operational",
    uptime: 99.6,
    responseTime: 300,
    description: "Portfolio images and document storage"
  },
  {
    name: "Payment Processing",
    status: "operational",
    uptime: 99.9,
    responseTime: 150,
    description: "Secure payment processing and transactions"
  }
];

const recentIncidents: Incident[] = [
  {
    id: "INC-2024-001",
    title: "API Response Time Degradation",
    status: "resolved",
    severity: "minor",
    description: "Some API endpoints were experiencing slower response times due to increased load.",
    startedAt: "2024-01-15T10:30:00Z",
    resolvedAt: "2024-01-15T12:45:00Z",
    affectedServices: ["API", "Website"]
  },
  {
    id: "INC-2024-002",
    title: "Database Connection Issues",
    status: "resolved",
    severity: "major",
    description: "Intermittent database connection issues affecting user authentication and data retrieval.",
    startedAt: "2024-01-10T14:20:00Z",
    resolvedAt: "2024-01-10T16:30:00Z",
    affectedServices: ["Database", "API", "Website"]
  },
  {
    id: "INC-2024-003",
    title: "Scheduled Maintenance",
    status: "resolved",
    severity: "minor",
    description: "Planned maintenance window for system updates and performance improvements.",
    startedAt: "2024-01-05T02:00:00Z",
    resolvedAt: "2024-01-05T04:00:00Z",
    affectedServices: ["API", "Website", "Database"]
  }
];

const systemMetrics = [
  {
    name: "Total Users",
    value: "12,847",
    change: "+5.2%",
    trend: "up",
    icon: Users
  },
  {
    name: "Active Jobs",
    value: "3,421",
    change: "+12.1%",
    trend: "up",
    icon: Activity
  },
  {
    name: "Messages Sent",
    value: "28,932",
    change: "+8.7%",
    trend: "up",
    icon: MessageSquare
  },
  {
    name: "API Requests",
    value: "1.2M",
    change: "+15.3%",
    trend: "up",
    icon: Server
  }
];

export default function Status() {
  const { user } = useAuth();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "outage":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "maintenance":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 border-green-200";
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "outage":
        return "bg-red-100 text-red-800 border-red-200";
      case "maintenance":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "major":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "minor":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {user && <ProfileNavigation />}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
              System Status
            </h1>
            <p className="text-muted-foreground">
              Real-time status of SeekCa services and infrastructure
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <CardTitle className="text-2xl">All Systems Operational</CardTitle>
                <CardDescription>
                  All services are running normally. No incidents reported.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {systemMetrics.map((metric) => (
            <Card key={metric.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                      {metric.name}
                    </p>
                    <p className="text-xl md:text-2xl font-bold">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-600 flex-shrink-0" />
                      <span className="text-xs md:text-sm text-green-600">{metric.change}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <metric.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Services Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Service Status
            </CardTitle>
            <CardDescription>
              Current status of all SeekCa services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                    {getStatusIcon(service.status)}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm md:text-base">{service.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6">
                    <div className="text-left sm:text-right">
                      <div className="text-xs md:text-sm font-medium">{service.uptime}% uptime</div>
                      <div className="text-xs text-muted-foreground">
                        {service.responseTime}ms avg response
                      </div>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Recent Incidents
            </CardTitle>
            <CardDescription>
              Past incidents and maintenance windows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{incident.title}</h3>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge variant="outline">
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Started: {new Date(incident.startedAt).toLocaleString()}</span>
                    {incident.resolvedAt && (
                      <span>Resolved: {new Date(incident.resolvedAt).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {incident.affectedServices.map((service) => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Status History
            </CardTitle>
            <CardDescription>
              Uptime statistics for the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Status History Chart</h3>
              <p className="text-muted-foreground mb-4">
                Detailed uptime and performance metrics coming soon
              </p>
              <Button variant="outline">
                View Detailed Metrics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Status page updates every minute. For real-time updates, subscribe to our{" "}
            <Link to="/community" className="text-primary hover:underline">
              status notifications
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
