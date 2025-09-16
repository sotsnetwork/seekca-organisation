import { useState } from "react";
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
  Activity,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
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

        {/* System Metrics - Coming Soon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                    Total Users
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-muted-foreground">--</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs md:text-sm text-muted-foreground">Coming Soon</span>
                  </div>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                    Active Jobs
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-muted-foreground">--</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs md:text-sm text-muted-foreground">Coming Soon</span>
                  </div>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                    Messages Sent
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-muted-foreground">--</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs md:text-sm text-muted-foreground">Coming Soon</span>
                  </div>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                    API Requests
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-muted-foreground">--</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs md:text-sm text-muted-foreground">Coming Soon</span>
                  </div>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <Server className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Status - Basic Status Only */}
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base">API</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Core API endpoints and authentication</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6">
                  <div className="text-left sm:text-right">
                    <div className="text-xs md:text-sm font-medium text-muted-foreground">Status monitoring coming soon</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Operational
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base">Website</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Main website and user interface</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6">
                  <div className="text-left sm:text-right">
                    <div className="text-xs md:text-sm font-medium text-muted-foreground">Status monitoring coming soon</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Operational
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base">Database</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Primary database and data storage</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6">
                  <div className="text-left sm:text-right">
                    <div className="text-xs md:text-sm font-medium text-muted-foreground">Status monitoring coming soon</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Operational
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg space-y-3 sm:space-y-0">
                <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm md:text-base">Messaging</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Real-time messaging and notifications</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6">
                  <div className="text-left sm:text-right">
                    <div className="text-xs md:text-sm font-medium text-muted-foreground">Status monitoring coming soon</div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Operational
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents - No Data */}
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
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold mb-2">No Recent Incidents</h3>
              <p className="text-muted-foreground">
                No incidents or maintenance windows have been reported recently.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status History - Coming Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Status History
            </CardTitle>
            <CardDescription>
              Uptime statistics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Status History Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                Detailed uptime and performance metrics will be available soon.
              </p>
              <Button variant="outline" disabled>
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
      
      <Footer />
    </div>
  );
}