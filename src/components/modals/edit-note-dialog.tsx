"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface EditNoteDialogProps {
  open: boolean;
  currentContent: string;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
}

export const EditNoteDialog: React.FC<EditNoteDialogProps> = ({
  open,
  currentContent,
  onClose,
  onSave,
}) => {
  const [content, setContent] = useState(currentContent);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setContent(currentContent);
  }, [currentContent, open]);

  const handleSave = async () => {
    if (!content.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(content);
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-grey border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Note</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your note content below
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your note..."
            className="min-h-[200px] bg-lightgrey border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400"
            disabled={isSaving}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="bg-green/80 text-white hover:bg-green"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
