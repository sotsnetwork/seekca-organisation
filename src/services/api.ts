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
  verified: boolean;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  skills_required: string[];
  deadline?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  user_id: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  job_id?: string;
  read: boolean;
  created_at: string;
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
      // Mock data for now
      const mockJobs: Job[] = [
        {
          id: "1",
          title: "Kitchen Renovation",
          description: "Complete kitchen renovation including cabinets, countertops, and appliances.",
          location: "New York, NY",
          budget: 15000,
          skills_required: ["Carpentry", "Plumbing", "Electrical Work"],
          deadline: "2024-03-15",
          status: "open",
          created_at: "2024-02-01T10:00:00Z",
          user_id: "user1"
        },
        {
          id: "2",
          title: "Bathroom Remodel",
          description: "Full bathroom remodel with new fixtures, tiles, and lighting.",
          location: "Los Angeles, CA",
          budget: 8000,
          skills_required: ["Plumbing", "Tiling", "Electrical Work"],
          deadline: "2024-03-30",
          status: "open",
          created_at: "2024-02-05T14:30:00Z",
          user_id: "user2"
        }
      ];

      let filtered = mockJobs;
      
      if (filters?.status) {
        filtered = filtered.filter(job => job.status === filters.status);
      }
      
      if (filters?.location) {
        filtered = filtered.filter(job => 
          job.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      return filtered;
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

  // Messages
  static async getMessages(filters?: {
    conversation_id?: string;
    unread_only?: boolean;
  }): Promise<Message[]> {
    try {
      // Mock data for now
      const mockMessages: Message[] = [
        {
          id: "1",
          sender_id: "user1",
          recipient_id: "user2",
          subject: "Kitchen Renovation Project",
          content: "Hi! I'm interested in your kitchen renovation project. Can we discuss the details?",
          job_id: "1",
          read: false,
          created_at: "2024-02-10T10:00:00Z"
        },
        {
          id: "2",
          sender_id: "user2",
          recipient_id: "user1",
          subject: "Re: Kitchen Renovation Project",
          content: "Absolutely! I'd love to discuss the project with you. When would be a good time to chat?",
          job_id: "1",
          read: true,
          created_at: "2024-02-10T14:30:00Z"
        }
      ];

      let filtered = mockMessages;
      
      if (filters?.conversation_id) {
        filtered = filtered.filter(msg => msg.job_id === filters.conversation_id);
      }
      
      if (filters?.unread_only) {
        filtered = filtered.filter(msg => !msg.read);
      }

      return filtered;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  static async sendMessage(messageData: Omit<Message, 'id' | 'created_at' | 'read'>): Promise<Message> {
    try {
      // Mock implementation
      const newMessage: Message = {
        id: Date.now().toString(),
        ...messageData,
        read: false,
        created_at: new Date().toISOString(),
      };
      
      console.log('Message sent:', newMessage);
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
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
