// src/components/patient/ai-assistant-dialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

interface AIAssistantDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AIAssistantDialog({ open, onClose }: AIAssistantDialogProps) {
  const [message, setMessage] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assistant Médical IA</DialogTitle>
          <p className="text-sm text-gray-500">
            Posez vos questions sur vos symptômes, traitements ou rendez-vous.
          </p>
        </DialogHeader>
        
        <div className="h-96 overflow-y-auto mb-4 p-4 rounded-lg">
          {/* Messages de discussion */}
          <div className="space-y-4">
            <div className="flex justify-start">
              <div className=" p-3 rounded-lg max-w-xs md:max-w-md dark:bg-gray-700 bg-blue-100">
                <p>Bonjour ! Je suis votre assistant médical. Comment puis-je vous aider aujourd'hui ?</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Posez votre question..."
            className="flex-1"
          />
          <Button>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}