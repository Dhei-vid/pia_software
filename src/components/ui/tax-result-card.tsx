"use client";

import { FC, useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Scale, BookOpen, ChevronDown, ChevronUp, DollarSign, Percent } from "lucide-react";

interface TaxResultCardProps {
  message?: string;
  answer?: string;
  confidence?: string;
  eligible?: boolean;
  references?: Array<{ note: string; section: string }>;
  calculation?: {
    amount?: number;
    breakdown?: Array<{ description: string; amount: number; rate: string }>;
    effectiveRate?: number;
  };
  className?: string;
}

const TaxResultCard: FC<TaxResultCardProps> = ({
  message,
  answer,
  confidence = "high",
  eligible,
  references = [],
  calculation,
  className,
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Get confidence color
  const getConfidenceColor = () => {
    switch (confidence.toLowerCase()) {
      case 'high':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Top Message (if exists) */}
      {message && (
        <div className="bg-gradient-to-r from-blue-400/5 to-transparent border border-blue-400/20 rounded-lg p-4">
          <p className="text-sm text-foreground/80">{message}</p>
        </div>
      )}

      {/* Main Answer Card */}
      {answer && (
        <div className="border border-lightgrey rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400/5 to-transparent px-6 py-4 border-b border-lightgrey">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-foreground">Tax Analysis</h2>
              </div>
              
              {/* Confidence Badge */}
              <span className={cn("px-3 py-1 text-xs rounded-full border flex items-center gap-1", getConfidenceColor())}>
                <CheckCircle size={12} />
                {confidence} confidence
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                {answer}
              </div>
            </div>
          </div>
        </div>
      )}

      {calculation && (
        <div className="border border-green-400/20 rounded-lg overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400/5 to-transparent px-6 py-3 border-b border-green-400/20 flex items-center justify-between cursor-pointer"
            onClick={() => setShowBreakdown(!showBreakdown)}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <h3 className="text-sm font-semibold text-foreground">Tax Calculation</h3>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>
          
          <div className="p-4">
            {/* Eligibility Status */}
            {eligible !== undefined && (
              <div className="flex items-center gap-2 mb-3">
                {eligible ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Eligible for tax calculation</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-yellow-400">Not eligible for tax calculation</span>
                  </>
                )}
              </div>
            )}

            {/* Tax Amount */}
            {calculation.amount && (
              <div className="mb-4">
                <p className="text-3xl font-bold text-green-400">
                  ₦{calculation.amount.toLocaleString()}
                </p>
                {calculation.effectiveRate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Effective Tax Rate: {calculation.effectiveRate}%
                  </p>
                )}
              </div>
            )}

            {/* Breakdown (collapsible) */}
            {calculation.breakdown && showBreakdown && (
              <div className="mt-4 pt-4 border-t border-lightgrey">
                <p className="text-xs text-muted-foreground mb-3">Calculation Breakdown:</p>
                <div className="space-y-2 bg-dark/50 rounded-lg p-3">
                  {calculation.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span className="text-foreground/70">{item.description}</span>
                      <span className="text-foreground font-mono">
                        ₦{item.amount.toLocaleString()} at {item.rate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* References Section */}
      {references.length > 0 && (
        <div className="border border-lightgrey rounded-lg overflow-hidden">
          <div className="bg-dark/50 px-6 py-3 border-b border-lightgrey">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold text-foreground">Legal References</h3>
            </div>
          </div>
          <div className="divide-y divide-lightgrey">
            {references.map((ref, index) => (
              <div key={index} className="p-4 hover:bg-dark/30 transition-colors">
                <p className="text-xs text-blue-400 font-medium mb-1">{ref.section}</p>
                <p className="text-xs text-foreground/70">{ref.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxResultCard;