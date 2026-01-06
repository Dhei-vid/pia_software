import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ComparisonDetailedFindings } from "@/api/compliance/compliance-type";

const DetailedFindingsCard: FC<ComparisonDetailedFindings> = ({
  category,
  analysis,
  complianceStatus,
  piaReference,
  provision,
  recommendation,
  severity,
}) => {
  const getSeverityVariant = (severity: "high" | "low" | "medium") => {
    switch (severity) {
      case "high":
        return "destructive";
      case "low":
        return "low";
      case "medium":
        return "medium";
      default:
        return "default";
    }
  };
  return (
    <div className="space-y-3 border rounded-md p-3">
      <div className="flex gap-2 items-center">
        <p className="text-sm text-foreground">Category:</p>
        <Badge variant={"outline"} className="text-xs text-foreground/80">
          {category}
        </Badge>
      </div>

      <Separator />

      {/* Analysis */}
      <div className="flex flex-row gap-2">
        <p className="text-sm">Analysis:</p>
        <p className="text-sm text-foreground/70">{analysis}.</p>
      </div>

      <Separator />

      {/* Recommendation */}
      <div className="flex flex-row gap-2">
        <p className="text-sm">Recommendation:</p>
        <p className="text-sm text-foreground/70">{recommendation}.</p>
      </div>

      <Separator />

      {/* Severity */}
      <div className="flex">
        <Badge className="ml-auto" variant={getSeverityVariant(severity)}>
          {severity} severity
        </Badge>
      </div>
    </div>
  );
};

export default DetailedFindingsCard;
