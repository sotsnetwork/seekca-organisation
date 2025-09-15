import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import PostJob from "./pages/PostJob";
import Projects from "./pages/Projects";
import HelpCenter from "./pages/HelpCenter";
import APIDocs from "./pages/APIDocs";
import Community from "./pages/Community";
import Status from "./pages/Status";
import Teams from "./pages/Teams";
import TeamsManagement from "./pages/TeamsManagement";
import PasswordReset from "./pages/PasswordReset";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
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

export default App;
