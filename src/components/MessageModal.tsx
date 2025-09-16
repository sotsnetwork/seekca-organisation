import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface Professional {
  id: string;
  full_name: string;
  nickname: string;
  avatar_url?: string;
}

interface MessageModalProps {
  professional: Professional | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MessageModal({
  professional,
  isOpen,
  onClose
}: MessageModalProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!professional) return null;

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!user) {
      toast.error("Please sign in to send messages");
      return;
    }

    setIsSending(true);
    try {
      // TODO: Implement real messaging with Supabase
      // For now, simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Message sent to ${professional.full_name}`);
      setMessage("");
      onClose();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={professional.avatar_url} />
              <AvatarFallback>
                {professional.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span>Message {professional.full_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder={`Hi ${professional.full_name}, I'm interested in your services...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || !message.trim()}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
