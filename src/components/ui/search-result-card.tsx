"use client";

import { FC } from "react";
import { Button } from "./button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultCardProps {
  title: string;
  description: string;
  onViewFullSection?: () => void;
  className?: string;
}

const SearchResultCard: FC<SearchResultCardProps> = ({
  title,
  description,
  onViewFullSection,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-grey border border-lightgrey rounded-lg p-6 hover:bg-lightgrey transition-colors duration-200",
        className
      )}
    >
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{description}</p>
      </div>

      {/* Action Button */}
      {onViewFullSection && (
        <Button
          variant="outline"
          size="sm"
          onClick={onViewFullSection}
          className="bg-transparent text-green border border-green hover:text-green/80 hover:bg-green/10 p-2 h-auto"
        >
          <span className="mr-2">View Full Section</span>
          <ArrowUpRight size={25} />
        </Button>
      )}
    </div>
  );
};

export default SearchResultCard;
