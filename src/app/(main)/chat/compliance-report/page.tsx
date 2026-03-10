"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, FileText, Calculator, Scale, BookOpen, CheckCircle, Clock, Hash, DollarSign, TrendingUp } from "lucide-react";
import { ComplianceComparisonData } from "@/api/compliance/compliance-type";
import DetailedFindingsCard from "@/components/pages/compliance-report/detailed-findings-card";
import RecommendationCard from "@/components/pages/compliance-report/recommendation-card";
import RiskAssessmentCard from "@/components/pages/compliance-report/risk-assessment-card";
import LoadingSpinner from "@/components/ui/loading";
import { formatTimeAgo } from "@/common/helpers";
import { ComplianceDocument } from "@/api/compliance/compliance";
import { DocumentService } from "@/api/documents/document";
import { Searches } from "@/api/documents/document-types";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const comparisonId = searchParams.get("comparisonId");

  const [complianceReport, setComplianceReport] = useState<ComplianceComparisonData | null>(null);
  const [historyItem, setHistoryItem] = useState<Searches | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!comparisonId) {
        setError("No comparison ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // FIRST: try to fetch history item
        try {
          const historyResponse = await DocumentService.getSearchHistoryItem(comparisonId);
          console.log("History response:", historyResponse);

          if (historyResponse?.success && historyResponse?.data) {
            setHistoryItem(historyResponse.data);
            setIsLoading(false);
            return;
          }
        } catch (historyError) {
          console.log("Not a history item, trying compliance...");
        }

        // SECOND: try compliance
        try {
          const complianceResponse = await ComplianceDocument.getByComparisonID(comparisonId);
          if (complianceResponse?.data?.comparison) {
            setComplianceReport(complianceResponse.data.comparison);
            setIsLoading(false);
            return;
          }
        } catch (complianceError) {
          console.log("Not a compliance report");
        }

        setError("Report not found");
      } catch (err) {
        console.error(err);
        setError("Error loading report");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [comparisonId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state
  if (error || (!complianceReport && !historyItem)) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Report not found"}</p>
          <button
            onClick={() => router.push("/chat")}
            className="px-4 py-2 bg-yellow-400 text-black rounded-md hover:bg-yellow-500"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  // If it's a compliance report, show the ORIGINAL EXACT UI
  if (complianceReport) {
    return (
      <div>
        {/* Translate button - kept exactly as in original */}
        <button onClick={async () => {
          console.log("Start....");
          const translated = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: "Hello, how are you?",
              sourceLang: "English",
              targetLang: "Spanish",
            }),
          }).then(res => res.json());
          console.log("Translated ", translated);
        }}>Translate</button>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="cursor-pointer flex items-center text-sm space-x-2 text-gray-300 hover:text-white transition-colors mb-6 rounded-md border p-2"
        >
          <ChevronLeft size={18} />
          <span>Back to Chat</span>
        </button>

        {/* Report body - EXACT original UI */}
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

  // For history items, use the professional UI dispatcher
  if (historyItem) {
    return <HistoryItemDispatcher item={historyItem} router={router} />;
  }

  return null;
}

// Smart dispatcher component that examines the data structure
function HistoryItemDispatcher({ item, router }: { item: Searches; router: any }) {
  const results = item.results as any;
  
  console.log("Dispatching history item:", {
    id: item.id,
    type: item.type,
    results: results,
    hasAnalysis: !!results?.analysis,
    hasOverview: !!results?.analysis?.overview,
    hasDetailedFindings: !!results?.analysis?.detailedFindings?.length,
    hasRecommendations: !!results?.analysis?.recommendations,
    hasRiskAssessment: !!results?.analysis?.riskAssessment,
    hasResult: !!results?.result,
    hasChunks: !!results?.chunks,
    source: results?.source
  });

  const resolveHistoryType = (results: any) => {
    // Check for compliance data (inside analysis)
    if (results?.analysis?.overview && results?.analysis?.detailedFindings) {
      return "compliance";
    }

    // Check for tax document upload
    if (results?.source === "tax_document_upload" || results?.analysis?.answeredQuestions?.length) {
      return "tax-document";
    }

    // Check for tax query
    if (results?.source === "tax_query" || results?.result?.answer) {
      return "tax-query";
    }

    // Check for search results
    if (results?.chunks?.length) {
      return "search";
    }

    return "raw";
  };

  const type = resolveHistoryType(results);

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="cursor-pointer flex items-center text-sm space-x-2 text-gray-300 hover:text-white transition-colors mb-6 rounded-md border p-2"
      >
        <ChevronLeft size={18} />
        <span>Back to Chat</span>
      </button>

      {/* Header with enhanced styling */}
      <div className="mb-8 border-b border-lightgrey pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              {item.displayTitle || item.query}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatTimeAgo(item.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <FileText size={14} />
                {item.document.title}
              </span>
              <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 text-xs rounded-full">
                {type === "compliance" ? "Compliance Check" : 
                 type === "tax-document" ? "Document Analysis" : 
                 type === "tax-query" ? "Tax Query" : 
                 type === "search" ? "Search Results" : 
                 "Report"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Render the appropriate professional view */}
      {type === "compliance" && (
        <ComplianceView 
          data={results.analysis} 
          query={item.query} 
        />
      )}
      {type === "tax-document" && <TaxDocumentUploadView results={results} />}
      {type === "tax-query" && <TaxQueryView results={results} />}
      {type === "search" && <SearchResultsView results={results} />}
      {type === "raw" && <RawResultsView data={results} query={item.query} />}
    </div>
  );
}

// Compliance View using your existing UI components
function ComplianceView({ data, query }: { data: any; query: string }) {
  console.log("Rendering ComplianceView with data:", data);
  
  if (!data) {
    return <div className="text-center py-12 text-muted-foreground">No compliance data available</div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="font-bold text-lg uppercase">{query}</p>
      </div>

      {/* Overview */}
      {data.overview && (
        <div className="space-y-2">
          <p className="font-bold text-lg text-foreground">Overview</p>
          <p className="text-sm text-foreground/70">{data.overview.summary}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            {data.overview.complianceScore && (
              <div className="bg-dark p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Compliance Score</p>
                <p className="text-2xl font-bold text-yellow-400">{data.overview.complianceScore}%</p>
              </div>
            )}
            
            {data.overview.totalProvisionsAnalyzed && (
              <div className="bg-dark p-4 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Provisions Analyzed</p>
                <p className="text-2xl font-bold text-foreground">{data.overview.totalProvisionsAnalyzed}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Major Compliance Areas */}
      {data.overview?.majorComplianceAreas && data.overview.majorComplianceAreas.length > 0 && (
        <div className="space-y-2">
          <p className="font-bold">Major Compliance Areas:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.overview.majorComplianceAreas.map((area: string, i: number) => (
              <div key={i} className="rounded-md border p-4">
                <p className="text-foreground/80 text-sm">{area.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Findings */}
      {data.detailedFindings && data.detailedFindings.length > 0 && (
        <div className="space-y-2">
          <p className="font-bold">Detailed Findings:</p>
          <div className="grid grid-cols-2 gap-3">
            {data.detailedFindings.map((finding: any, i: number) => (
              <DetailedFindingsCard key={i} {...finding} />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations && (
        <div className="space-y-2">
          <p className="font-bold">Recommendations:</p>
          <RecommendationCard
            allRecommendations={data.recommendations.allRecommendations ?? []}
            complianceTimeline={data.recommendations.complianceTimeline ?? ""}
            immediateActions={data.recommendations.immediateActions ?? []}
            priorityAreas={data.recommendations.priorityAreas ?? []}
          />
        </div>
      )}

      {/* Risk Assessment */}
      {data.riskAssessment && (
        <div className="space-y-2">
          <p className="font-bold">Risk Assessment:</p>
          <div className="grid md:grid-cols-2 gap-3">
            <RiskAssessmentCard 
              label="Overall Risk" 
              assessment={data.riskAssessment.overallRisk ?? ""} 
            />
            <RiskAssessmentCard 
              label="High Risk Issues" 
              assessment={data.riskAssessment.highRiskIssues ?? 0} 
            />
            <RiskAssessmentCard 
              label="Medium Risk Issues" 
              assessment={data.riskAssessment.mediumRiskIssues ?? 0} 
            />
            <RiskAssessmentCard 
              label="Low Risk Issues" 
              assessment={data.riskAssessment.lowRiskIssues ?? 0} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Professional Tax Document Upload View
function TaxDocumentUploadView({ results }: { results: any }) {
  // Handle both direct analysis and nested analysis
  const analysis = results?.analysis || results;
  
  if (!analysis || !analysis.answeredQuestions) {
    return <div className="text-center py-12 text-muted-foreground">No analysis data available</div>;
  }

  // Calculate statistics
  const totalQuestions = analysis.answeredQuestions?.length || 0;
  const calculationsPerformed = analysis.answeredQuestions?.filter((q: any) => q.type === 'calculation').length || 0;
  const highConfidence = analysis.answeredQuestions?.filter((q: any) => q.confidence === 'high').length || 0;

  return (
    <div className="space-y-8">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-400/10 to-transparent border border-yellow-400/20 rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Document Type</p>
              <p className="text-lg font-semibold text-foreground capitalize">{analysis.documentType?.replace('_', ' ') || 'Tax Document'}</p>
            </div>
            <FileText className="w-8 h-8 text-yellow-400/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400/10 to-transparent border border-blue-400/20 rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Word Count</p>
              <p className="text-lg font-semibold text-foreground">{analysis.wordCount?.toLocaleString() || 0}</p>
            </div>
            <Hash className="w-8 h-8 text-blue-400/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-400/10 to-transparent border border-green-400/20 rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Confidence</p>
              <p className="text-lg font-semibold text-green-400 capitalize">{analysis.confidence || 'N/A'}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-400/10 to-transparent border border-purple-400/20 rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Analysis Method</p>
              <p className="text-lg font-semibold text-foreground capitalize">{analysis.analysisMethod?.replace(/_/g, ' ') || 'Standard'}</p>
            </div>
            <Calculator className="w-8 h-8 text-purple-400/50" />
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <section className="border border-lightgrey rounded-lg overflow-hidden">
        <div className="bg-dark/50 px-6 py-4 border-b border-lightgrey">
          <h2 className="text-lg font-semibold text-foreground">Executive Summary</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-foreground/80 leading-relaxed">{analysis.summary}</p>
          
          {/* Key Findings Pills */}
          {analysis.keyFindings && analysis.keyFindings.length > 0 && (
            <div className="mt-4 pt-4 border-t border-lightgrey">
              <p className="text-xs text-muted-foreground mb-3">Key Findings:</p>
              <div className="flex flex-wrap gap-2">
                {analysis.keyFindings.map((finding: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-400/10 text-blue-400 text-xs rounded-full border border-blue-400/20">
                    {finding}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Question Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark/30 rounded-lg p-5 border border-lightgrey">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <FileText className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-sm text-muted-foreground">Total Questions</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalQuestions}</p>
        </div>

        <div className="bg-dark/30 rounded-lg p-5 border border-lightgrey">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-400/10 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground">High Confidence</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{highConfidence}</p>
        </div>

        <div className="bg-dark/30 rounded-lg p-5 border border-lightgrey">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-400/10 rounded-lg">
              <Calculator className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-sm text-muted-foreground">Calculations</p>
          </div>
          <p className="text-2xl font-bold text-purple-400">{calculationsPerformed}</p>
        </div>
      </div>

      {/* Questions & Answers */}
      {analysis.answeredQuestions && analysis.answeredQuestions.length > 0 && (
        <section className="border border-lightgrey rounded-lg overflow-hidden">
          <div className="bg-dark/50 px-6 py-4 border-b border-lightgrey">
            <h2 className="text-lg font-semibold text-foreground">Questions & Analysis</h2>
          </div>
          <div className="divide-y divide-lightgrey">
            {analysis.answeredQuestions.map((qa: any, i: number) => (
              <div key={i} className="p-6 hover:bg-dark/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {qa.type === 'calculation' ? (
                        <Calculator className="w-4 h-4 text-purple-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-blue-400" />
                      )}
                      <h3 className="text-sm font-medium text-foreground">
                        {qa.question}
                      </h3>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ml-4 ${
                    qa.confidence === 'high' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
                    qa.confidence === 'medium' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                    'bg-red-400/10 text-red-400 border border-red-400/20'
                  }`}>
                    {qa.confidence} confidence
                  </span>
                </div>
                
                <div className="pl-7">
                  <div className="bg-dark/50 rounded-lg p-4 mb-3 border border-lightgrey">
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                      {qa.answer}
                    </p>
                  </div>

                  {/* Tax Calculation Display */}
                  {qa.taxCalculation && (
                    <div className="bg-gradient-to-br from-green-400/5 to-transparent border border-green-400/20 rounded-lg p-4 mb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <p className="text-xs font-medium text-green-400">Tax Calculation</p>
                      </div>
                      {qa.taxCalculation.eligible ? (
                        <>
                          <p className="text-2xl font-bold text-green-400 mb-3">
                            ₦{qa.taxCalculation.amount?.toLocaleString()}
                          </p>
                          {qa.taxCalculation.breakdown && (
                            <div className="space-y-2 bg-dark/50 rounded-lg p-3">
                              {qa.taxCalculation.breakdown.map((item: any, j: number) => (
                                <div key={j} className="flex justify-between text-xs">
                                  <span className="text-foreground/70">{item.description}</span>
                                  <span className="text-foreground font-mono">
                                    ₦{item.amount?.toLocaleString()} at {item.rate}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Effective Tax Rate: {qa.taxCalculation.effectiveRate}%
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-foreground/80">Not eligible for tax calculation</p>
                      )}
                    </div>
                  )}

                  {/* References */}
                  {qa.references && qa.references.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <BookOpen size={12} />
                        References:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {qa.references.map((ref: any, j: number) => (
                          <div key={j} className="px-3 py-1.5 bg-blue-400/5 rounded-md border border-blue-400/20">
                            <p className="text-xs text-blue-400 font-medium">{ref.section}</p>
                            <p className="text-xs text-foreground/70">{ref.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Professional Tax Query View
function TaxQueryView({ results }: { results: any }) {
  // Handle both direct result and nested result
  const queryResult = results?.result || results;
  
  if (!queryResult || !queryResult.answer) {
    return <div className="text-center py-12 text-muted-foreground">No result data available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Confidence Badge */}
      <div className="flex justify-end">
        <span className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1 ${
          queryResult.confidence === 'high' ? 'bg-green-400/10 text-green-400 border border-green-400/20' :
          queryResult.confidence === 'medium' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
          'bg-red-400/10 text-red-400 border border-red-400/20'
        }`}>
          <CheckCircle size={12} />
          {queryResult.confidence} confidence response
        </span>
      </div>

      {/* Answer Card */}
      <section className="border border-lightgrey rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-400/5 to-transparent px-6 py-4 border-b border-lightgrey">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-foreground">Tax Guidance</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            <div className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {queryResult.answer}
            </div>
          </div>
        </div>
      </section>

      {/* References */}
      {queryResult.references && queryResult.references.length > 0 && (
        <section className="border border-lightgrey rounded-lg overflow-hidden">
          <div className="bg-dark/50 px-6 py-4 border-b border-lightgrey">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-foreground">Legal References</h2>
            </div>
          </div>
          <div className="divide-y divide-lightgrey">
            {queryResult.references.map((ref: any, i: number) => (
              <div key={i} className="p-4 hover:bg-dark/30 transition-colors">
                <p className="text-xs text-blue-400 font-medium mb-1">{ref.section}</p>
                <p className="text-xs text-foreground/70">{ref.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Professional Search Results View
function SearchResultsView({ results }: { results: any }) {
  const chunks = results?.chunks || [];
  const aiResponse = results?.aiResponse;

  return (
    <div className="space-y-8">
      {aiResponse && (
        <section className="border border-lightgrey rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-400/5 to-transparent px-6 py-4 border-b border-lightgrey">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-foreground">AI Analysis</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
          </div>
        </section>
      )}

      {chunks.length > 0 && (
        <section className="border border-lightgrey rounded-lg overflow-hidden">
          <div className="bg-dark/50 px-6 py-4 border-b border-lightgrey">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-semibold text-foreground">Relevant Sections ({chunks.length})</h2>
            </div>
          </div>
          <div className="divide-y divide-lightgrey">
            {chunks.map((chunk: any, i: number) => (
              <div key={i} className="p-5 hover:bg-dark/30 transition-colors">
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                  {chunk.chapter || `Section ${i + 1}`}
                </h3>
                <p className="text-xs text-foreground/70 leading-relaxed pl-3 border-l-2 border-lightgrey">
                  {chunk.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Professional Raw Results View (fallback)
function RawResultsView({ data, query }: { data: any; query: string }) {
  // If data has analysis (compliance data), show it properly
  if (data?.analysis?.overview) {
    return <ComplianceView data={data.analysis} query={query} />;
  }
  
  // If data has result (tax query), show it properly
  if (data?.result?.answer) {
    return <TaxQueryView results={data} />;
  }
  
  // If data has chunks (search), show it properly
  if (data?.chunks?.length) {
    return <SearchResultsView results={data} />;
  }
  
  // Otherwise show raw JSON
  return (
    <div className="space-y-6">
      <div className="border border-lightgrey rounded-lg overflow-hidden">
        <div className="bg-dark/50 px-6 py-3 border-b border-lightgrey">
          <h2 className="text-sm font-semibold text-foreground">Response Data</h2>
        </div>
        <div className="p-4">
          <pre className="text-xs text-foreground/70 overflow-auto max-h-96 bg-dark/50 p-4 rounded-lg font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
























// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { ChevronLeft } from "lucide-react";
// import { ComplianceComparisonData } from "@/api/compliance/compliance-type";
// import DetailedFindingsCard from "@/components/pages/compliance-report/detailed-findings-card";
// import RecommendationCard from "@/components/pages/compliance-report/recommendation-card";
// import RiskAssessmentCard from "@/components/pages/compliance-report/risk-assessment-card";

// // API
// import { ComplianceDocument } from "@/api/compliance/compliance";

// export default function Page() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const comparisonId = searchParams.get("comparisonId");

//   const [trans, setTrans] = useState<string | null>("");

//   const [complianceReport, setComplianceReport] =
//     useState<ComplianceComparisonData | null>(null);

//   async function translateText({
//     text,
//     sourceLang,
//     targetLang,
//   }: {
//     text: string;
//     sourceLang: string;
//     targetLang: string;
//   }) {
//     const res = await fetch("/api/translate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text, sourceLang, targetLang }),
//     });

//     if (!res.ok) {
//       throw new Error("Translation failed");
//     }

//     const data = await res.json();
//     return data.translation;
//   }

//   const fetchTranslatedText = async () => {
//     console.log("Start....");
//     const translated = await translateText({
//       text: "Hello, how are you?",
//       sourceLang: "English",
//       targetLang: "Spanish",
//     });

//     console.log("Translated ", translated);
//     setTrans(translated);
//   };

//   console.log(trans);

//   useEffect(() => {
//     const getComplianceReportByID = async (id: string) => {
//       if (!id) return;

//       try {
//         const respose = await ComplianceDocument.getByComparisonID(id);

//         setComplianceReport(respose.data.comparison);
//       } catch (error) {
//         console.error("Error fetching compliance report by ID:", error);
//       }
//     };

//     getComplianceReportByID(comparisonId as string);
//   }, [comparisonId]);

//   if (!complianceReport) {
//     return (
//       <div className="flex items-center justify-center">
//         <p className="text-foreground">Result not found</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <button onClick={fetchTranslatedText}>Translate</button>

//       {/* Back Button */}
//       <button
//         onClick={() => router.back()}
//         className="cursor-pointer flex items-center text-sm space-x-2 text-gray-300 hover:text-white transition-colors mb-6 rounded-md border p-2"
//       >
//         <ChevronLeft size={18} />
//         <span>Back to Chat</span>
//       </button>

//       {/* Report body */}
//       <div className="space-y-5">
//         {/* Header */}
//         <div>
//           <p className="font-bold text-lg uppercase">
//             {complianceReport?.query}
//           </p>
//         </div>

//         {/* Comparison Results */}
//         <div className="space-y-5">
//           {/* Overview */}
//           <div className="space-y-5">
//             <div className="space-y-2">
//               <p className="font-bold text-lg text-foreground">Overview</p>
//               <div>
//                 <p className="text-sm text-foreground/70">
//                   {complianceReport?.results?.overview?.summary}.
//                 </p>
//               </div>
//             </div>

//             {/* Compliance areas */}
//             <div className="space-y-2">
//               <div>
//                 <p className="font-bold">Major Compliance Areas:</p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {complianceReport?.results?.overview?.majorComplianceAreas?.map(
//                   (areas, index) => (
//                     <div key={index} className="rounded-md border p-4">
//                       <p className="text-foreground/80 text-sm text-wrap">
//                         {areas}
//                       </p>
//                     </div>
//                   )
//                 )}
//               </div>
//             </div>

//             {/* Detailed Findings */}
//             <div className="space-y-2">
//               <div>
//                 <p className="font-bold">Detailed Findings:</p>
//               </div>
//               <div className="grid grid-cols-2 gap-3 space-y-3">
//                 {complianceReport?.results?.detailedFindings?.map(
//                   (finding, index) => (
//                     <DetailedFindingsCard key={index} {...finding} />
//                   )
//                 )}
//               </div>
//             </div>

//             {/* Recommendations */}
//             <div className="space-y-2">
//               <div>
//                 <p className="font-bold">Recommendations:</p>
//               </div>
//               <div className="space-y-3">
//                 <RecommendationCard
//                   allRecommendations={
//                     complianceReport?.results?.recommendations
//                       ?.allRecommendations ?? []
//                   }
//                   complianceTimeline={
//                     complianceReport?.results?.recommendations
//                       ?.complianceTimeline ?? ""
//                   }
//                   immediateActions={
//                     complianceReport?.results?.recommendations
//                       ?.immediateActions ?? []
//                   }
//                   priorityAreas={
//                     complianceReport?.results?.recommendations?.priorityAreas ??
//                     []
//                   }
//                 />
//               </div>
//             </div>

//             {/* Risk Assessment */}
//             <div className="space-y-2">
//               <p className="font-bold">Risk Assessment:</p>

//               <div className="grid md:grid-cols-2 gap-3">
//                 <RiskAssessmentCard
//                   label="Overall Risk"
//                   assessment={
//                     complianceReport?.results?.riskAssessment?.overallRisk ?? ""
//                   }
//                 />

//                 <RiskAssessmentCard
//                   label="High Risk Issues"
//                   assessment={
//                     complianceReport?.results?.riskAssessment?.highRiskIssues ??
//                     0
//                   }
//                 />

//                 <RiskAssessmentCard
//                   label="Medium Risk Issues"
//                   assessment={
//                     complianceReport?.results?.riskAssessment
//                       ?.mediumRiskIssues ?? 0
//                   }
//                 />

//                 <RiskAssessmentCard
//                   label="Low Risk Issues"
//                   assessment={
//                     complianceReport?.results?.riskAssessment?.lowRiskIssues ??
//                     0
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
