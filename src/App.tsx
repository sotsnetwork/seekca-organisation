import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { withLazyLoading } from "@/components/LazyWrapper";
import { usePerformance } from "@/hooks/use-performance";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { Analytics } from '@vercel/analytics/react';

// Critical pages loaded immediately
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Non-critical pages loaded lazily
const About = withLazyLoading(() => import("./pages/About"));
const Blog = withLazyLoading(() => import("./pages/Blog"));
const Careers = withLazyLoading(() => import("./pages/Careers"));
const Contact = withLazyLoading(() => import("./pages/Contact"));
const Profile = withLazyLoading(() => import("./pages/Profile"));
const Messages = withLazyLoading(() => import("./pages/Messages"));
const Portfolio = withLazyLoading(() => import("./pages/Portfolio"));
const Settings = withLazyLoading(() => import("./pages/Settings"));
const PostJob = withLazyLoading(() => import("./pages/PostJob"));
const Projects = withLazyLoading(() => import("./pages/Projects"));
const HelpCenter = withLazyLoading(() => import("./pages/HelpCenter"));
const APIDocs = withLazyLoading(() => import("./pages/APIDocs"));
const Community = withLazyLoading(() => import("./pages/Community"));
const Status = withLazyLoading(() => import("./pages/Status"));
const Teams = withLazyLoading(() => import("./pages/Teams"));
const TeamsManagement = withLazyLoading(() => import("./pages/TeamsManagement"));
const PasswordReset = withLazyLoading(() => import("./pages/PasswordReset"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Initialize performance monitoring
  usePerformance();
  
  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Analytics />
            <Toaster />
            <Sonner />
            <PerformanceMonitor />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/api-docs" element={<APIDocs />} />
            <Route path="/community" element={<Community />} />
            <Route path="/status" element={<Status />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams-management" element={<TeamsManagement />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;
