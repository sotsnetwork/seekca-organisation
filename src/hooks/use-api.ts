import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService, Professional, Job, Message } from "@/services/api";

// Query keys
export const queryKeys = {
  professionals: ['professionals'] as const,
  professional: (id: string) => ['professionals', id] as const,
  jobs: ['jobs'] as const,
  messages: ['messages'] as const,
};

// Professionals hooks
export function useProfessionals(filters?: {
  location?: string;
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...queryKeys.professionals, filters],
    queryFn: () => ApiService.getProfessionals(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: queryKeys.professional(id),
    queryFn: () => ApiService.getProfessional(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Jobs hooks
export function useJobs(filters?: {
  status?: string;
  location?: string;
  category?: string;
}) {
  return useQuery({
    queryKey: [...queryKeys.jobs, filters],
    queryFn: () => ApiService.getJobs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobData: Omit<Job, 'id' | 'created_at' | 'user_id'>) => 
      ApiService.createJob(jobData),
    onSuccess: () => {
      // Invalidate and refetch jobs
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
    },
  });
}

// Messages hooks
export function useMessages(filters?: {
  conversation_id?: string;
  unread_only?: boolean;
}) {
  return useQuery({
    queryKey: [...queryKeys.messages, filters],
    queryFn: () => ApiService.getMessages(filters),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageData: Omit<Message, 'id' | 'created_at' | 'read'>) => 
      ApiService.sendMessage(messageData),
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
}

// Contact form hook
export function useSubmitContactForm() {
  return useMutation({
    mutationFn: (formData: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      subject: string;
      message: string;
    }) => ApiService.submitContactForm(formData),
  });
}
