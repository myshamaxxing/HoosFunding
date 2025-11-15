export type RequestCategory = "Tech" | "Staffing" | "Facilities" | "Training" | "Other";

export type UserRole = "Student" | "Professor" | "Staff" | "Other";

export interface FundingRequest {
  id: string;
  name: string;
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

export interface RankedRequest {
  id: string;
  priorityRank: number;
  alignmentScore: number; // 0–100
  reasoning: string;
}

export interface Recommendation {
  priority: string;
  category: RequestCategory | "Other";
  rationale: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  rankedRequests: RankedRequest[];
}

