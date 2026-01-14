"use client";

import { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface SupportDialogProps {
  open: boolean;
  title: string;
  description: string;
  phoneNumbers: string[];
  onClose: () => void;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
}

export const SupportDialog: FC<SupportDialogProps> = ({
  open,
  title,
  description,
  onClose,
  phoneNumbers,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-dark border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* phone number */}
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-foreground/80">
              Phone Numbers to Reach out to
            </p>
          </div>
          <div
            className={`grid grid-cols-${phoneNumbers.length} gap-5 flex-wrap divide-x-1 divide-muted-foreground`}
          >
            {phoneNumbers.map((phone, index) => (
              <div key={index}>
                <p className="text-sm text-muted-foreground">{phone}</p>
              </div>
            ))}
          </div>
        </div>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green text-white hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Email
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
