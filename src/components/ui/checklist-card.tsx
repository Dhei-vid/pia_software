"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit3, Trash2, FileText, ArrowUpRight } from "lucide-react";

interface ChecklistCardProps {
  id: string;
  title: string;
  completed: boolean;
  document?: {
    id: string;
    title: string;
    section?: string;
  };
  content?: string;
  timestamp: string | Date;
  onToggle?: (id: string) => void;
  onEdit?: (id: string) => void;
  onAddNote?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewLinked?: (documentId: string) => void;
  className?: string;
}

const ChecklistCard: FC<ChecklistCardProps> = ({
  id,
  title,
  completed,
  document,
  // content,
  // timestamp,
  onToggle,
  onEdit,
  onAddNote,
  onDelete,
  onViewLinked,
  className = "",
}) => {
  const handleToggle = () => {
    onToggle?.(id);
  };

  const handleEdit = () => {
    onEdit?.(id);
  };

  const handleAddNote = () => {
    onAddNote?.(id);
  };

  const handleDelete = () => {
    onDelete?.(id);
  };

  const handleViewLinked = () => {
    if (document?.id) {
      onViewLinked?.(document.id);
    }
  };

  return (
    <div className={`bg-lightgrey rounded-xl p-6 space-y-4 ${className}`}>
      {/* Header with Title and Checkbox */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-base font-medium text-white">{title}</h3>
        </div>
        <Checkbox
          id={id}
          checked={completed}
          onCheckedChange={handleToggle}
          className="mt-0.5"
        />
      </div>

      {/* Linked Document Section - Only shown when linked */}
      {document && (
        <div className="bg-grey p-3 rounded-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-1">Linked to:</p>
              <p className="text-sm font-medium text-white">
                {document.section ? `${document.section}: ` : ""}
                {document.title}
              </p>
            </div>
            <button
              onClick={handleViewLinked}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="View linked section"
            >
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100/20">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Edit3 size={14} />
          Edit Checklist
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddNote}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <FileText size={14} />
          Add Note
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="border-red-500/60 text-red-400 hover:!bg-destructive"
        >
          <Trash2 size={14} />
          Delete Checklist
        </Button>
      </div>
    </div>
  );
};

export default ChecklistCard;
