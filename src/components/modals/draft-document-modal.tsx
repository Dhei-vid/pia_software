"use client";

import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface IDraftDocumentModal {
  isOpen: boolean;
  onClose: () => void;
  onDraftDocument: () => void;
  onCancel: () => void;
}

const DraftDocumentModal: FC<IDraftDocumentModal> = ({
  isOpen,
  onClose,
  onDraftDocument,
  onCancel,
}) => {
  const handleDraftDocument = () => {
    onDraftDocument();
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="space-y-6 bg-lightgrey max-w-lg mx-auto"
        showCloseButton={false}
      >
        <DialogHeader className="text-center"></DialogHeader>
        {/* Success Indicator */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center mb-3 border border-white">
            <Check className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-white text-lg font-medium">
            Copied to clipboard!
          </DialogTitle>
        </div>

        {/* Question Panel */}
        <div className="bg-dark space-y-8 rounded-lg p-4 mb-6">
          <p className="text-white text-left text-base">
            Would you like to draft a document with this text?
          </p>

          {/* Action Buttons */}
          <div className="ml-auot flex gap-3">
            <Button
              variant={"outline"}
              onClick={handleDraftDocument}
              className="w-fit flex-1 !border-green hover:bg-green/90 border border-green-600 text-green flex items-center justify-center gap-2 text-sm"
            >
              <Check className="w-4 h-4" />
              Yes, Draft Document
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-fit flex-1 bg-transparent border-white text-white hover:bg-white flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              No, Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DraftDocumentModal;
