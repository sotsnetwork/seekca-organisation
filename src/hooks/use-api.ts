import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService, Professional, Job, Message, Conversation } from "@/services/api";

// Query keys
export const queryKeys = {
  professionals: ['professionals'] as const,
  professional: (id: string) => ['professionals', id] as const,
  jobs: ['jobs'] as const,
  conversations: ['conversations'] as const,
  messages: (conversationId: string) => ['messages', conversationId] as const,
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

export function useDeleteJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => ApiService.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs });
    },
  });
}

// Messaging hooks
export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => ApiService.getConversations(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId),
    queryFn: () => ApiService.getMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 10 * 1000, // Refetch every 10 seconds for real-time updates
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ conversationId, content, messageType }: { 
      conversationId: string; 
      content: string; 
      messageType?: 'text' | 'image' | 'file' | 'system' 
    }) => ApiService.sendMessage(conversationId, content, messageType),
    onSuccess: (_, variables) => {
      // Invalidate and refetch messages for this conversation
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(variables.conversationId) });
      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

export function useGetOrCreateConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (otherUserId: string) => ApiService.getOrCreateConversation(otherUserId),
    onSuccess: () => {
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

export function useMarkMessagesAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (conversationId: string) => ApiService.markMessagesAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      // Invalidate conversations to update unread counts
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({ queryKey: queryKeys.messages(conversationId) });
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
