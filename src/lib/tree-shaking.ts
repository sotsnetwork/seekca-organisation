// Tree-shaking utilities for removing unused code

// Only import what you need from libraries
export { 
  // React Query - only import specific functions
  useQuery, 
  useMutation, 
  useQueryClient,
  QueryClient,
  QueryClientProvider 
} from '@tanstack/react-query';

// Date utilities - only import used functions
export { 
  format, 
  parseISO, 
  addDays, 
  subDays,
  isToday,
  isYesterday 
} from 'date-fns';

// Form utilities - only import used functions
export { 
  useForm, 
  Controller,
  useController 
} from 'react-hook-form';

// Validation - only import used functions
export { 
  z, 
  ZodError 
} from 'zod';

// UI utilities - only import used functions
export { 
  cn 
} from '@/lib/utils';

// Supabase - only import used functions
export { 
  createClient,
  type SupabaseClient 
} from '@supabase/supabase-js';

// Re-export commonly used components to avoid deep imports
export { Button } from '@/components/ui/button';
export { Input } from '@/components/ui/input';
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export { Textarea } from '@/components/ui/textarea';
export { Badge } from '@/components/ui/badge';
export { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export { Separator } from '@/components/ui/separator';
export { Skeleton } from '@/components/ui/skeleton';
export { Spinner } from '@/components/ui/spinner';
export { Switch } from '@/components/ui/switch';
export { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export { Toast, Toaster } from '@/components/ui/toaster';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Icons - only import used icons
export { 
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Share,
  Download,
  Upload,
  Edit,
  Trash,
  Plus,
  Minus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Settings,
  LogOut,
  LogIn,
  Home,
  Users,
  Briefcase,
  MessageCircle,
  Bell,
  HelpCircle,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle
} from 'lucide-react';
