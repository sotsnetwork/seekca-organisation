import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import TeamDashboard from "@/components/TeamDashboard";

export default function TeamsManagement() {
  const { user } = useAuth();
  const { data: userRole, isLoading: roleLoading, error: roleError } = useUserRole();  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to manage your teams.</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'professional') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Only professionals can manage teams.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <TeamDashboard />
      </main>
      <Footer />
    </div>
  );
}
