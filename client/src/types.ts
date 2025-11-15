export type RequestCategory = "Tech" | "Staffing" | "Facilities" | "Training" | "Other";

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
  avgResourcesRating: number;
  avgTeachingRating: number;
  topThemes: Theme[];
  sampleComments: string[];
}

export interface RankedRequest {
  id: string;
  priorityRank: number;
  alignmentScore: number;
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

export type NewFundingRequest = Omit<FundingRequest, "id" | "status" | "createdAt">;

