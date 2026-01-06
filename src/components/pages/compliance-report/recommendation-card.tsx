import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ComparisonRecommendations } from "@/api/compliance/compliance-type";

const RecommendationCard: FC<ComparisonRecommendations> = ({
  allRecommendations,
  complianceTimeline,
  immediateActions,
  priorityAreas,
}) => {
  return (
    <div className="space-y-3 border rounded-md p-3">
      <div className="flex gap-2 items-center">
        <p className="text-sm text-foreground">Priority Areas:</p>

        <div className="space-x-1">
          {priorityAreas.map((area, index) => (
            <Badge
              key={index}
              variant={"outline"}
              className="text-xs text-foreground/80"
            >
              {area}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* All Recommendations */}
      <div className="space-y-2">
        <p className="font-bold text-sm">All Recommendations:</p>

        <ol className="list-decimal pl-5">
          {allRecommendations.map((item, index) => (
            <li key={index} className="text-sm text-foreground/80">
              {item}.
            </li>
          ))}
        </ol>
      </div>

      <Separator />

      {/* Immediate Actions */}
      <div className="space-y-2">
        <p className="font-bold text-sm">Immediate Actions:</p>

        <ol className="list-decimal pl-5">
          {immediateActions.map((item, index) => (
            <li key={index} className="text-sm text-foreground/80">
              {item}.
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecommendationCard;
