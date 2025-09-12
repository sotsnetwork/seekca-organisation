import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type UserRole = 'professional' | 'hirer' | null;

export function useUserRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      console.log('Fetching role for user:', user.id);
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          // If table doesn't exist or other error, try to get role from user metadata
          const roleFromMetadata = user.user_metadata?.role;
          console.log('Role from metadata:', roleFromMetadata);
          return roleFromMetadata as UserRole || null;
        }

        console.log('User role data:', data);
        return data?.role as UserRole;
      } catch (err) {
        console.error('Exception fetching user role:', err);
        // Fallback to user metadata
        const roleFromMetadata = user.user_metadata?.role;
        console.log('Role from metadata (fallback):', roleFromMetadata);
        return roleFromMetadata as UserRole || null;
      }
    },
    enabled: !!user?.id,
    retry: 1,
  });
}