import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Save, X, Upload, Camera, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import SkillSelector from "@/components/SkillSelector";
import CountrySelector from "@/components/CountrySelector";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileNavigation from "@/components/ProfileNavigation";
import { ProfilePictureCropper } from "@/components/ProfilePictureCropper";

// Profile form validation schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  nickname: z.string().min(2, "Nickname must be at least 2 characters"),
  country: z.string().min(1, "Please select a country"),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  hourlyRate: z.string().optional().or(z.literal("")),
  location: z.string().min(2, "Location must be at least 2 characters"),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const AVATAR_BUCKET = 'avatars';
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    Array.isArray(user?.user_metadata?.skills) 
      ? user.user_metadata.skills 
      : user?.user_metadata?.skills?.split(',').filter(Boolean) || []
  );

  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    nickname: user?.user_metadata?.nickname || '',
    country: user?.user_metadata?.country || '',
    bio: user?.user_metadata?.bio || '',
    skills: user?.user_metadata?.skills || [],
    hourlyRate: user?.user_metadata?.hourlyRate || '',
    location: user?.user_metadata?.location || '',
    avatarUrl: user?.user_metadata?.avatar_url || '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      nickname: user?.user_metadata?.nickname || '',
      country: user?.user_metadata?.country || '',
      bio: user?.user_metadata?.bio || '',
      hourlyRate: user?.user_metadata?.hourlyRate || '',
      location: user?.user_metadata?.location || '',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Upsert profile data to the profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: data.fullName,
          nickname: data.nickname,
          country: data.country,
          bio: data.bio,
          skills: selectedSkills,
          hourly_rate: parseFloat(data.hourlyRate) || null,
          location: data.location,
          avatar_url: profileData.avatarUrl,
        });

      if (error) {
        throw error;
      }

      // Update local state
      setProfileData(prev => ({
        ...prev,
        fullName: data.fullName,
        nickname: data.nickname,
        country: data.country,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        location: data.location,
        skills: selectedSkills
      }));
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    setSelectedSkills(
      Array.isArray(user?.user_metadata?.skills) 
        ? user.user_metadata.skills 
        : user?.user_metadata?.skills?.split(',').filter(Boolean) || []
    );
    setIsEditing(false);
  };

  const handleCroppedImageUpload = async (croppedImageBlob: Blob) => {
    if (!user) return;

    try {
      setIsUploadingAvatar(true);

      const filePath = `avatars/${user.id}-${Date.now()}.jpg`;

      // Upload to Supabase Storage (ensure an 'avatars' bucket exists and is public)
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, croppedImageBlob, {
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get a public URL for the uploaded image
      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Optimistically update local state
      setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));

      // Update avatar URL in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          avatar_url: publicUrl,
          full_name: profileData.fullName,
          nickname: profileData.nickname,
          country: profileData.country,
          bio: profileData.bio,
          skills: profileData.skills,
          hourly_rate: parseFloat(profileData.hourlyRate) || null,
          location: profileData.location,
        });

      if (updateError) {
        throw updateError;
      }

      setIsCropperOpen(false);
      
      toast({
        title: 'Profile photo updated',
        description: 'Your profile photo has been saved.',
      });
    } catch (error: any) {
      console.error('Avatar upload failed:', error);
      const message = String(error?.message || '').toLowerCase().includes('bucket not found')
        ? `Storage bucket '${AVATAR_BUCKET}' not found. Create it in Supabase Storage or set VITE_SUPABASE_AVATAR_BUCKET to an existing bucket name.`
        : (error?.message || 'Could not upload profile photo. Please try again.');
      toast({
        title: 'Upload failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your profile.</p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileNavigation />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account and professional information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatarUrl || user.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {getInitials(watchedValues.nickname || watchedValues.fullName || user.user_metadata?.nickname || user.user_metadata?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <Button
                        size="sm"
                        onClick={() => setIsCropperOpen(true)}
                        className="rounded-full p-2 h-8 w-8"
                        disabled={isUploadingAvatar}
                      >
                        {isUploadingAvatar ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl">
                  {watchedValues.nickname || watchedValues.fullName || user.user_metadata?.nickname || user.user_metadata?.full_name}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
                {watchedValues.nickname && (
                  <CardDescription className="text-sm text-muted-foreground">
                    {watchedValues.fullName}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since:</span>
                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-green-600 font-medium">Verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Update your profile details and preferences</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                     <Button onClick={handleSubmit(onSubmit)} size="sm" disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                      <Button onClick={() => {
                        reset();
                        setIsEditing(false);
                      }} variant="outline" size="sm" disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      disabled={!isEditing}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nickname">Nickname (Display Name)</Label>
                    <Input
                      id="nickname"
                      {...register("nickname")}
                      disabled={!isEditing}
                      placeholder="Professional name to display"
                      className={errors.nickname ? "border-destructive" : ""}
                    />
                    {errors.nickname && (
                      <p className="text-sm text-destructive mt-1">{errors.nickname.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <CountrySelector
                      value={watchedValues.country}
                      onValueChange={(value) => setValue("country", value)}
                      placeholder="Select your country"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      disabled={!isEditing}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      {...register("hourlyRate")}
                      disabled={!isEditing}
                      placeholder="25"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Professional Skills</Label>
                    {isEditing && (
                      <p className="text-sm text-muted-foreground mb-3">
                        Select up to 5 skills that best represent your expertise. You can update these anytime.
                      </p>
                    )}
                    {isEditing ? (
                      <SkillSelector
                        selectedSkills={selectedSkills}
                        onSkillsChange={setSelectedSkills}
                        maxSkills={5}
                      />
                    ) : (
                      <div className="mt-2">
                        {selectedSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedSkills.map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">No skills added yet</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      {...register("bio")}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself and your expertise..."
                      className={errors.bio ? "border-destructive" : ""}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.bio && (
                        <p className="text-sm text-destructive">{errors.bio.message}</p>
                      )}
                      <p className="text-sm text-muted-foreground ml-auto">
                        {watchedValues.bio?.length || 0}/500
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <ProfilePictureCropper
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          onCropComplete={handleCroppedImageUpload}
          isUploading={isUploadingAvatar}
        />
      </div>
    </div>
  );
}