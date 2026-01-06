/**
 * Upload Document Response Types and Interfaces - START
 */

export interface ComplianceAnalysisResponse {
  success: boolean;
  message: string;
  data: ComplianceAnalysisData;
}

export interface ComplianceAnalysisData {
  analysis: Analysis;
  metadata: Metadata;
  comparisonId: string;
}

export interface Analysis {
  overview: Overview;
  detailedFindings: DetailedFinding[];
  riskAssessment: RiskAssessment;
  recommendations: Recommendations;
  analysisMethod: "local_analysis" | string;
  analysisTimestamp: string; // ISO 8601
}

export interface Overview {
  complianceScore: number;
  summary: string;
  totalProvisionsAnalyzed: number;
  majorComplianceAreas: string[];
}

export interface DetailedFinding {
  category: string;
  provision: string;
  complianceStatus: "compliant" | "non_compliant";
  piaReference: string;
  analysis: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
}

export interface RiskAssessment {
  highRiskIssues: number;
  mediumRiskIssues: number;
  lowRiskIssues: number;
  overallRisk: "low" | "medium" | "high";
}

export interface Recommendations {
  immediateActions: string[];
  priorityAreas: string[];
  complianceTimeline: "immediate_action_required" | string;
  allRecommendations: string[];
}

export interface Metadata {
  userDocument: UserDocument;
  piaDocument: PiaDocument;
}

export interface UserDocument {
  filename: string;
  totalSections: number;
  wordCount: number;
  analyzedContentLength: number;
}

export interface PiaDocument {
  title: string;
  reference: string;
  chunksAnalyzed: number;
}

/**
 * Upload Document Response Types and Interfaces - END
 */

/**
 * Get Document Response Types and Interfaces - START
 */
export interface GetComplianceDocumentResponse {
  message: string;
  success: boolean;
  data: ComplianceComparisonData;
}

export interface ComplianceComparisonData {
  id: string;
  createdAt: string; // ISO 8601
  document: {
    id: string;
    title: string;
  };
  query: string;
  results: ComparisonResult;
  userId: string;
}

export interface ComparisonResult {
  detailedFindings: ComparisonDetailedFindings[];
  overview: ComparisonOverview;
  recommendations: ComparisonRecommendations;
  riskAssessment: ComparisonRiskAssessment;
}

export interface ComparisonDetailedFindings {
  analysis: string;
  category: string;
  complianceStatus: string;
  piaReference: string;
  provision: string;
  recommendation: string;
  severity: "high" | "low" | "medium";
}

export interface ComparisonOverview {
  complianceScore: number;
  majorComplianceAreas: string[];
  summary: string;
  totalProvisionsAnalyzed: number;
}

export interface ComparisonRecommendations {
  allRecommendations: string[];
  complianceTimeline: string;
  immediateActions: string[];
  priorityAreas: string[];
}

export interface ComparisonRiskAssessment {
  overallRisk: string;
  highRiskIssues: number;
  lowRiskIssues: number;
  mediumRiskIssues: number;
}

/**
 * Get Document Response Types and Interfaces - END
 */
