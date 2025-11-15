import type {
  DepartmentSummary,
  FundingRequest,
  NewFundingRequest,
  RecommendationResponse,
  RequestCategory,
  PolicyInsightSummary,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || response.statusText);
  }
  return response.json() as Promise<T>;
}

export async function fetchDepartmentSummary(): Promise<DepartmentSummary> {
  const response = await fetch(`${API_BASE}/department-summary`);
  return handleResponse<DepartmentSummary>(response);
}

export async function fetchRequests(): Promise<FundingRequest[]> {
  const response = await fetch(`${API_BASE}/requests`);
  return handleResponse<FundingRequest[]>(response);
}

export async function createRequest(input: NewFundingRequest): Promise<FundingRequest> {
  const response = await fetch(`${API_BASE}/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<FundingRequest>(response);
}

export async function fetchRecommendations(): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<RecommendationResponse>(response);
}

export async function precheckRequest(input: {
  category: RequestCategory;
  description: string;
}): Promise<{ preCheckMessage: string; commonDenialReasons: string[] }> {
  const response = await fetch(`${API_BASE}/precheck-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<{ preCheckMessage: string; commonDenialReasons: string[] }>(response);
}

export async function fetchPolicyInsights(): Promise<PolicyInsightSummary> {
  const response = await fetch(`${API_BASE}/policy-insights`);
  return handleResponse<PolicyInsightSummary>(response);
}

