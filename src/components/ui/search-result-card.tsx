"use client";

import { FC, useState, useMemo } from "react";
import { Button } from "./button";
// import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDescriptionWithLists } from "@/common/helpers";

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
  const [showMore, setShowMore] = useState<boolean>(false);

  // Format description with proper line breaks for lists
  const formattedDescription = useMemo(() => {
    return formatDescriptionWithLists(description);
  }, [description]);

  return (
    <div
      className={cn(
        "bg-grey border border-lightgrey rounded-lg p-6 hover:bg-lightgrey transition-colors duration-200",
        className
      )}
    >
      <div>
        <h3 className="text-base font-semibold text-foreground/70 hover:text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p
          className={cn(
            showMore ? "" : "line-clamp-3",
            "text-muted-foreground text-sm mb-4 whitespace-pre-line"
          )}
        >
          {formattedDescription}
        </p>
      </div>

      {/* Action Button */}
      {onViewFullSection && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMore(!showMore)}
          className="bg-transparent text-green border border-green hover:text-green/80 hover:bg-green/10 p-2 h-auto"
        >
          <span className="mr-2">{showMore ? "Hide" : "Show More"}</span>
          {/* <ArrowUpRight size={25} /> */}
        </Button>
      )}
    </div>
  );
};

export default SearchResultCard;
