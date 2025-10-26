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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditChecklistDialogProps {
  open: boolean;
  currentTitle: string;
  onClose: () => void;
  onSave: (title: string) => Promise<void>;
}

export const EditChecklistDialog: React.FC<EditChecklistDialogProps> = ({
  open,
  currentTitle,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(currentTitle);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle, open]);

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(title);
      onClose();
    } catch (error) {
      console.error("Error saving checklist:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-grey border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Checklist</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update your checklist title below
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter checklist title..."
            className="bg-lightgrey border-gray-600 text-white placeholder:text-gray-500 focus:border-yellow-400"
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
            disabled={isSaving || !title.trim()}
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

