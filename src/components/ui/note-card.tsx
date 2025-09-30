"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, ArrowUpRight } from "lucide-react";
import { formatTimeAgo } from "@/common/helpers";

interface NoteCardProps {
  id: string;
  linkedSection?: {
    title: string;
    href?: string;
  };
  excerpt?: string;
  content: string;
  timestamp: string | Date;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewLinked?: (href: string) => void;
  className?: string;
}

const NoteCard: FC<NoteCardProps> = ({
  id,
  linkedSection,
  excerpt,
  content,
  timestamp,
  onEdit,
  onDelete,
  onViewLinked,
  className = "",
}) => {
  const handleEdit = () => {
    onEdit?.(id);
  };

  const handleDelete = () => {
    onDelete?.(id);
  };

  const handleViewLinked = () => {
    if (linkedSection?.href) {
      onViewLinked?.(linkedSection.href);
    }
  };

  return (
    <div className={`bg-lightgrey rounded-xl p-6 space-y-4 ${className}`}>
      {/* Linked Section Header */}
      {linkedSection && (
        <div className="flex items-start justify-between bg-dark p-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">
              Linked to: {linkedSection.title}
            </p>
            {excerpt && (
              <p className="text-sm text-gray-400 leading-relaxed">{excerpt}</p>
            )}
          </div>
          {linkedSection.href && (
            <button
              onClick={handleViewLinked}
              className="ml-3 p-1 text-gray-400 hover:text-white transition-colors"
              title="View linked section"
            >
              <ArrowUpRight size={18} />
            </button>
          )}
        </div>
      )}

      {/* Note Content */}
      <div className="space-y-3">
        <p className="text-gray-300 leading-relaxed">{content}</p>

        {/* Timestamp */}
        <p className="text-sm text-gray-400">
          Added on: {formatTimeAgo(timestamp)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <Button
          variant={"outline"}
          size="sm"
          onClick={handleEdit}
          className="text-gray-50/50 hover:text-white bg-transparent border border-gray-50/50 hover:bg-gray-700/50 p-2"
        >
          <Edit3 size={16} className="mr-2" />
          Edit Note
        </Button>

        <Button
          size="sm"
          onClick={handleDelete}
          className="border border-destructive/90 text-destructive/80 bg-transparent hover:bg-destructive hover:text-white/70"
        >
          <Trash2 size={16} className="mr-2" />
          Delete Note
        </Button>
      </div>
    </div>
  );
};

export default NoteCard;
