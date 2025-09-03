import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Save, X, Upload, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import SkillSelector from "@/components/SkillSelector";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
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

  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    Array.isArray(user?.user_metadata?.skills) 
      ? user.user_metadata.skills 
      : user?.user_metadata?.skills?.split(',').filter(Boolean) || []
  );

  const handleSave = () => {
    // TODO: Implement profile update logic with Supabase
    // Update the profileData with selected skills
    setProfileData(prev => ({ ...prev, skills: selectedSkills }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      fullName: user?.user_metadata?.full_name || '',
      nickname: user?.user_metadata?.nickname || '',
      country: user?.user_metadata?.country || '',
      bio: user?.user_metadata?.bio || '',
      skills: user?.user_metadata?.skills || [],
      hourlyRate: user?.user_metadata?.hourlyRate || '',
      location: user?.user_metadata?.location || '',
      avatarUrl: user?.user_metadata?.avatar_url || '',
    });
    setSelectedSkills(
      Array.isArray(user?.user_metadata?.skills) 
        ? user.user_metadata.skills 
        : user?.user_metadata?.skills?.split(',').filter(Boolean) || []
    );
    setIsEditing(false);
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement actual file upload to Supabase storage
      // For now, create a local URL
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, avatarUrl: imageUrl }));
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account and professional information</p>
          </div>
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
                      {getInitials(profileData.nickname || profileData.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <label htmlFor="profile-picture" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors">
                          <Camera className="w-4 h-4" />
                        </div>
                        <input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl">
                  {profileData.nickname || profileData.fullName}
                </CardTitle>
                <CardDescription>{user.email}</CardDescription>
                {profileData.nickname && (
                  <CardDescription className="text-sm text-muted-foreground">
                    {profileData.fullName}
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
                      <Button onClick={handleSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
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
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nickname">Nickname (Display Name)</Label>
                    <Input
                      id="nickname"
                      value={profileData.nickname}
                      onChange={(e) => setProfileData(prev => ({ ...prev, nickname: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Professional name to display"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={profileData.country}
                      onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={(e) => setProfileData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="25"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Professional Skills</Label>
                    {isEditing ? (
                      <SkillSelector
                        selectedSkills={selectedSkills}
                        onSkillsChange={setSelectedSkills}
                        maxSkills={25}
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
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself and your expertise..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}