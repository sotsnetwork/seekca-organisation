import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  Download, 
  Trash2,
  Calendar,
  User,
  Search
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectFile {
  id: string;
  project_id: string;
  uploaded_by: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  created_at: string;
  uploader: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
}

interface ProjectFilesProps {
  projectId: string;
}

export default function ProjectFiles({ projectId }: ProjectFilesProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");

  // Fetch project files
  const { data: files = [], isLoading } = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('project_files')
          .select(`
            *,
            uploader:profiles!project_files_uploaded_by_fkey(full_name, nickname, avatar_url)
          `)
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching files:', error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error('Exception fetching files:', err);
        return [];
      }
    },
    enabled: !!projectId,
  });

  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `project-files/${projectId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      // Save file record to database
      const { data, error } = await supabase
        .from('project_files')
        .insert([{
          project_id: projectId,
          uploaded_by: user.id,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          file_type: file.type
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
      toast({
        title: "File Uploaded",
        description: "The file has been successfully uploaded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Error",
        description: `Failed to upload file: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
      toast({
        title: "File Deleted",
        description: "The file has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Error",
        description: `Failed to delete file: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFileMutation.mutate(file);
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <File className="w-5 h-5" />;
    
    if (fileType.startsWith('image/')) {
      return <Image className="w-5 h-5" />;
    } else if (fileType.includes('pdf') || fileType.includes('document')) {
      return <FileText className="w-5 h-5" />;
    } else {
      return <File className="w-5 h-5" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter files based on search and type
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || 
      (file.file_type?.startsWith(fileTypeFilter) || 
       (fileTypeFilter === 'other' && !file.file_type?.startsWith('image/') && !file.file_type?.includes('pdf')));
    
    return matchesSearch && matchesType;
  });

  const fileTypes = [
    { value: 'all', label: 'All Files' },
    { value: 'image/', label: 'Images' },
    { value: 'application/pdf', label: 'PDFs' },
    { value: 'other', label: 'Other' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Files Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Files</h3>
          <p className="text-sm text-muted-foreground">
            Share and manage project files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {files.length} files
          </Badge>
          <Button size="sm" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </label>
          </Button>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploadFileMutation.isPending}
          />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={fileTypeFilter}
          onChange={(e) => setFileTypeFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background text-sm"
        >
          {fileTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Files List */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No Files Yet</h4>
            <p className="text-muted-foreground mb-4">
              Upload files to share with your project partner.
            </p>
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload First File
              </label>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-muted-foreground">
                      {getFileIcon(file.file_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.file_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.file_size)}</span>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{file.uploader.nickname}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(file.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </Button>
                    
                    {file.uploaded_by === user?.id && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteFileMutation.mutate(file.id)}
                        disabled={deleteFileMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
