import { supabase } from "@/integrations/supabase/client";

// Types
export interface Professional {
  id: string;
  full_name: string;
  nickname: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  skills: string[];
  hourlyRate?: number;
  location?: string;
  country?: string;
  state?: string;
  city?: string;
  town?: string;
  verified: boolean;
  created_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  currency: string;
  skills: string[];
  location: string | null;
  remote_allowed: boolean;
  project_duration: string | null;
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'closed' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  read_at: string | null;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
}

export interface Conversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  participant1?: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
  participant2?: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
  last_message?: Message;
  unread_count?: number;
}

// API Service Functions
export class ApiService {
  // Professionals
  static async getProfessionals(filters?: {
    location?: string;
    skills?: string[];
    minRate?: number;
    maxRate?: number;
    page?: number;
    limit?: number;
  }): Promise<Professional[]> {
    try {
      // For now, return mock data since we don't have a real API
      // In a real app, this would call your backend API
      const mockProfessionals: Professional[] = [
        {
          id: "1",
          full_name: "John Smith",
          nickname: "JohnS",
          email: "john@example.com",
          avatar_url: "",
          bio: "Experienced plumber with 10+ years in residential and commercial work.",
          skills: ["Plumbing", "Pipe Repair", "Water Heater Installation"],
          hourlyRate: 45,
          location: "New York, NY",
          country: "United States",
          verified: true,
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: "2",
          full_name: "Sarah Johnson",
          nickname: "SarahJ",
          email: "sarah@example.com",
          avatar_url: "",
          bio: "Professional electrician specializing in home wiring and electrical repairs.",
          skills: ["Electrical Work", "Wiring", "Circuit Repair"],
          hourlyRate: 55,
          location: "Los Angeles, CA",
          country: "United States",
          verified: true,
          created_at: "2024-01-20T14:30:00Z"
        },
        {
          id: "3",
          full_name: "Mike Chen",
          nickname: "MikeC",
          email: "mike@example.com",
          avatar_url: "",
          bio: "Expert landscaper and garden designer with a passion for outdoor spaces.",
          skills: ["Landscaping", "Garden Design", "Tree Care"],
          hourlyRate: 35,
          location: "Austin, TX",
          country: "United States",
          verified: true,
          created_at: "2024-02-01T09:15:00Z"
        }
      ];

      // Apply filters
      let filtered = mockProfessionals;
      
      if (filters?.location) {
        filtered = filtered.filter(p => 
          p.location?.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters?.skills && filters.skills.length > 0) {
        filtered = filtered.filter(p => 
          filters.skills!.some(skill => 
            p.skills.some(pSkill => 
              pSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
      
      if (filters?.minRate) {
        filtered = filtered.filter(p => (p.hourlyRate || 0) >= filters.minRate!);
      }
      
      if (filters?.maxRate) {
        filtered = filtered.filter(p => (p.hourlyRate || 0) <= filters.maxRate!);
      }

      // Pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;

      return filtered.slice(start, end);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      throw new Error('Failed to fetch professionals');
    }
  }

  static async getProfessional(id: string): Promise<Professional | null> {
    try {
      const professionals = await this.getProfessionals();
      return professionals.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error fetching professional:', error);
      throw new Error('Failed to fetch professional');
    }
  }

  // Jobs
  static async getJobs(filters?: {
    status?: string;
    location?: string;
    category?: string;
  }): Promise<Job[]> {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      // category not in schema yet; ignore for now

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Job[];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }

  static async createJob(jobData: Omit<Job, 'id' | 'created_at' | 'user_id'>): Promise<Job> {
    try {
      // Mock implementation - in real app, this would call your API
      const newJob: Job = {
        id: Date.now().toString(),
        ...jobData,
        user_id: "current_user", // This would come from auth context
        created_at: new Date().toISOString(),
      };
      
      console.log('Job created:', newJob);
      return newJob;
    } catch (error) {
      console.error('Error creating job:', error);
      throw new Error('Failed to create job');
    }
  }

  static async deleteJob(jobId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      throw new Error('Failed to delete job');
    }
  }

  // Messaging System
  static async getConversations(): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          participant1:profiles!conversations_participant1_id_fkey(id, full_name, nickname, avatar_url),
          participant2:profiles!conversations_participant2_id_fkey(id, full_name, nickname, avatar_url),
          last_message:messages!conversations_last_message_at_fkey(
            id, content, created_at, sender_id,
            sender:profiles!messages_sender_id_fkey(id, full_name, nickname, avatar_url)
          )
        `)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Calculate unread counts for each conversation
      const conversationsWithUnread = await Promise.all(
        (data || []).map(async (conv) => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .is('read_at', null)
            .neq('sender_id', (await supabase.auth.getUser()).data.user?.id);

          return {
            ...conv,
            unread_count: count || 0
          };
        })
      );

      return conversationsWithUnread as Conversation[];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw new Error('Failed to fetch conversations');
    }
  }

  static async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, nickname, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as Message[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  static async sendMessage(conversationId: string, content: string, messageType: 'text' | 'image' | 'file' | 'system' = 'text'): Promise<Message> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.user.id,
          content,
          message_type: messageType
        })
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, nickname, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data as Message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  static async getOrCreateConversation(otherUserId: string): Promise<string> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_or_create_conversation', {
        user1_id: user.user.id,
        user2_id: otherUserId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw new Error('Failed to get or create conversation');
    }
  }

  static async markMessagesAsRead(conversationId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('mark_messages_as_read', {
        conversation_uuid: conversationId,
        reader_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  }

  // Contact form submission
  static async submitContactForm(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<void> {
    try {
      // Mock implementation - in real app, this would call your API
      console.log('Contact form submitted:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw new Error('Failed to submit contact form');
    }
  }
}
