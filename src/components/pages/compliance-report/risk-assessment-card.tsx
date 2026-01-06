import { cn } from "@/lib/utils";

const RiskAssessmentCard = ({
  label,
  assessment,
}: {
  label: string;
  assessment: string | number;
}) => {
  return (
    <div className="flex flex-row gap-4 border p-3 rounded-md items-center">
      <p className="text-sm font-medium">{label}</p>
      <span> - </span>
      <p className={cn("text-sm text-foreground/80 uppercase")}>{assessment}</p>
    </div>
  );
};

export default RiskAssessmentCard;
