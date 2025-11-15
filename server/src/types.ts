export type RequestCategory =
  | "Professional Development & Training"
  | "Conference Travel & Presentations"
  | "Teaching Materials, Software, & Subscriptions"
  | "Classroom & Instructional Technology"
  | "TA / Grader / Student Worker Support"
  | "Student Experience, Events, & Programming"
  | "Space, Furniture, & Facility Improvements"
  | "Research & Lab Equipment (mixed with teaching)"
  | "Other";

export type UserRole = "Student" | "Professor" | "Staff" | "Other";

export interface FundingRequest {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  category: RequestCategory;
  title: string;
  description: string;
  urgency: "Low" | "Medium" | "High";
  createdAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface Theme {
  theme: string;
  count: number;
}

export interface DepartmentSummary {
  departmentName: string;
  avgResourcesRating: number; // 1–5
  avgTeachingRating: number; // 1–5
  topThemes: Theme[];
  sampleComments: string[];
}

export type ViabilityStatus = "Likely" | "Risky" | "Needs Review";

export interface PolicyGreyArea {
  category: RequestCategory;
  summary: string;
  suggestion: string;
}

export interface RankedRequest {
  id: string;
  priorityRank: number;
  alignmentScore: number; // 0–100
  reasoning: string;
  pastDenialHint?: string | undefined;
  viability: ViabilityStatus;
  policyNote?: string | undefined;
}

export interface Recommendation {
  priority: string;
  category: RequestCategory | "Other";
  rationale: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  rankedRequests: RankedRequest[];
  policyGreyAreas: PolicyGreyArea[];
}

export interface CategoryInsight {
  category: RequestCategory;
  approvals: number;
  denials: number;
  approvalRate: number;
  topReasons: string[];
}

export interface PolicyInsightSummary {
  categories: CategoryInsight[];
  frequentGreyAreas: PolicyGreyArea[];
}

