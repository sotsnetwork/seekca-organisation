import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, MessageSquare, Briefcase, Clock, DollarSign, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { toast } from "sonner";

interface Professional {
  id: string;
  full_name: string;
  nickname: string;
  bio?: string;
  skills: string[];
  hourly_rate?: number;
  location?: string;
  country?: string;
  state?: string;
  city?: string;
  avatar_url?: string;
  verified: boolean;
  created_at: string;
  currency_code?: string;
  currency_symbol?: string;
}

interface ProfessionalProfileModalProps {
  professional: Professional | null;
  isOpen: boolean;
  onClose: () => void;
  onHire: (professional: Professional) => void;
  onMessage: (professional: Professional) => void;
}

export default function ProfessionalProfileModal({
  professional,
  isOpen,
  onClose,
  onHire,
  onMessage
}: ProfessionalProfileModalProps) {
  const { user } = useAuth();
  const { data: userRole } = useUserRole();
  const [isHiring, setIsHiring] = useState(false);

  if (!professional) return null;

  const handleHire = async () => {
    if (!user) {
      toast.error("Please sign in to hire professionals");
      return;
    }

    if (userRole !== 'hirer') {
      toast.error("Only hirers can hire professionals");
      return;
    }

    setIsHiring(true);
    try {
      // Simulate hire process
      await new Promise(resolve => setTimeout(resolve, 1000));
      onHire(professional);
      toast.success(`Hire request sent to ${professional.full_name}`);
      onClose();
    } catch (error) {
      toast.error("Failed to send hire request");
    } finally {
      setIsHiring(false);
    }
  };

  const handleMessage = () => {
    if (!user) {
      toast.error("Please sign in to message professionals");
      return;
    }
    onMessage(professional);
  };

  const formatLocation = () => {
    const parts = [professional.city, professional.state, professional.country].filter(Boolean);
    return parts.join(", ") || professional.location || "Location not specified";
  };

  const formatRate = () => {
    if (!professional.hourly_rate) return "Rate not specified";
    const symbol = professional.currency_symbol || "$";
    return `${symbol}${professional.hourly_rate}/hr`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={professional.avatar_url} />
              <AvatarFallback>
                {professional.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{professional.full_name}</h2>
                {professional.verified && (
                  <Shield className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{professional.nickname}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formatLocation()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formatRate()}</span>
                </div>
              </div>

              {professional.bio && (
                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-sm text-muted-foreground">{professional.bio}</p>
                </div>
              )}

              {professional.skills && professional.skills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Skills & Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {professional.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleMessage}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button
              onClick={handleHire}
              disabled={isHiring || userRole !== 'hirer'}
              className="flex-1"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              {isHiring ? "Sending..." : "Hire Now"}
            </Button>
          </div>

          {userRole !== 'hirer' && (
            <div className="text-center text-sm text-muted-foreground">
              Only hirers can hire professionals. Switch to hirer account to hire.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
