import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export function useProfileCompletion() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile-completion', user?.id],
    queryFn: async () => {
      if (!user) return { isComplete: false, missingFields: [] };

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.log('Error fetching profile:', error);
          return { isComplete: false, missingFields: ['profile'] };
        }

        if (!profile) {
          return { isComplete: false, missingFields: ['profile'] };
        }

        // Check required fields for a complete professional profile
        const requiredFields = [
          'full_name',
          'bio',
          'skills',
          'hourly_rate',
          'location',
          'country'
        ];

        const missingFields = requiredFields.filter(field => {
          const value = profile[field];
          return !value || (Array.isArray(value) && value.length === 0);
        });

        return {
          isComplete: missingFields.length === 0,
          missingFields,
          profile
        };
      } catch (err) {
        console.log('Error checking profile completion:', err);
        return { isComplete: false, missingFields: ['profile'] };
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
