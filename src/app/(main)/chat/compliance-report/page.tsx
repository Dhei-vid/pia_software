"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ComplianceComparisonData } from "@/api/compliance/compliance-type";
import DetailedFindingsCard from "@/components/pages/compliance-report/detailed-findings-card";
import RecommendationCard from "@/components/pages/compliance-report/recommendation-card";
import RiskAssessmentCard from "@/components/pages/compliance-report/risk-assessment-card";

// API
import { ComplianceDocument } from "@/api/compliance/compliance";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const comparisonId = searchParams.get("comparisonId");

  const [trans, setTrans] = useState<string | null>("");

  const [complianceReport, setComplianceReport] =
    useState<ComplianceComparisonData | null>(null);

  async function translateText({
    text,
    sourceLang,
    targetLang,
  }: {
    text: string;
    sourceLang: string;
    targetLang: string;
  }) {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang }),
    });

    if (!res.ok) {
      throw new Error("Translation failed");
    }

    const data = await res.json();
    return data.translation;
  }

  const fetchTranslatedText = async () => {
    console.log("Start....");
    const translated = await translateText({
      text: "Hello, how are you?",
      sourceLang: "English",
      targetLang: "Spanish",
    });

    console.log("Translated ", translated);
    setTrans(translated);
  };

  console.log(trans);

  useEffect(() => {
    const getComplianceReportByID = async (id: string) => {
      if (!id) return;

      try {
        const respose = await ComplianceDocument.getByComparisonID(id);

        setComplianceReport(respose.data.comparison);
      } catch (error) {
        console.error("Error fetching compliance report by ID:", error);
      }
    };

    getComplianceReportByID(comparisonId as string);
  }, [comparisonId]);

  if (!complianceReport) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-foreground">Result not found</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={fetchTranslatedText}>Translate</button>

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="cursor-pointer flex items-center text-sm space-x-2 text-gray-300 hover:text-white transition-colors mb-6 rounded-md border p-2"
      >
        <ChevronLeft size={18} />
        <span>Back to Chat</span>
      </button>

      {/* Report body */}
      <div className="space-y-5">
        {/* Header */}
        <div>
          <p className="font-bold text-lg uppercase">
            {complianceReport?.query}
          </p>
        </div>

        {/* Comparison Results */}
        <div className="space-y-5">
          {/* Overview */}
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="font-bold text-lg text-foreground">Overview</p>
              <div>
                <p className="text-sm text-foreground/70">
                  {complianceReport?.results?.overview?.summary}.
                </p>
              </div>
            </div>

            {/* Compliance areas */}
            <div className="space-y-2">
              <div>
                <p className="font-bold">Major Compliance Areas:</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {complianceReport?.results?.overview?.majorComplianceAreas?.map(
                  (areas, index) => (
                    <div key={index} className="rounded-md border p-4">
                      <p className="text-foreground/80 text-sm text-wrap">
                        {areas}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Detailed Findings */}
            <div className="space-y-2">
              <div>
                <p className="font-bold">Detailed Findings:</p>
              </div>
              <div className="grid grid-cols-2 gap-3 space-y-3">
                {complianceReport?.results?.detailedFindings?.map(
                  (finding, index) => (
                    <DetailedFindingsCard key={index} {...finding} />
                  )
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <div>
                <p className="font-bold">Recommendations:</p>
              </div>
              <div className="space-y-3">
                <RecommendationCard
                  allRecommendations={
                    complianceReport?.results?.recommendations
                      ?.allRecommendations ?? []
                  }
                  complianceTimeline={
                    complianceReport?.results?.recommendations
                      ?.complianceTimeline ?? ""
                  }
                  immediateActions={
                    complianceReport?.results?.recommendations
                      ?.immediateActions ?? []
                  }
                  priorityAreas={
                    complianceReport?.results?.recommendations?.priorityAreas ??
                    []
                  }
                />
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-2">
              <p className="font-bold">Risk Assessment:</p>

              <div className="grid md:grid-cols-2 gap-3">
                <RiskAssessmentCard
                  label="Overall Risk"
                  assessment={
                    complianceReport?.results?.riskAssessment?.overallRisk ?? ""
                  }
                />

                <RiskAssessmentCard
                  label="High Risk Issues"
                  assessment={
                    complianceReport?.results?.riskAssessment?.highRiskIssues ??
                    0
                  }
                />

                <RiskAssessmentCard
                  label="Medium Risk Issues"
                  assessment={
                    complianceReport?.results?.riskAssessment
                      ?.mediumRiskIssues ?? 0
                  }
                />

                <RiskAssessmentCard
                  label="Low Risk Issues"
                  assessment={
                    complianceReport?.results?.riskAssessment?.lowRiskIssues ??
                    0
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
