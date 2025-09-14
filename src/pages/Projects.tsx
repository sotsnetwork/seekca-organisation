import AppHeader from "@/components/AppHeader";
import ProfileNavigation from "@/components/ProfileNavigation";
import ProjectDashboard from "@/components/ProjectDashboard";
import { useUserRole } from "@/hooks/use-user-role";

export default function Projects() {
  const { data: userRole } = useUserRole();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <ProfileNavigation />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {userRole === 'hirer' ? 'My Job Postings' : 'My Projects'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {userRole === 'hirer' 
              ? 'Manage your job postings, review applications, and track project progress.'
              : 'Manage your active projects, track milestones, and communicate with clients.'
            }
          </p>
        </div>
        <ProjectDashboard />
      </main>
    </div>
  );
}
