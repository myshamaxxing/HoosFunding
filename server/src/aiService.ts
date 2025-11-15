import type { DepartmentSummary, FundingRequest, RecommendationResponse } from "./types";
import { buildPreCheckMessage, getCommonDenialMessagesForCategory } from "./policyCategories";

const LLM_API_URL = process.env.LLM_API_URL;
const LLM_API_KEY = process.env.LLM_API_KEY;

export async function getFundingRecommendations(
  deptSummary: DepartmentSummary,
  requests: FundingRequest[],
): Promise<RecommendationResponse> {
  if (LLM_API_URL && LLM_API_KEY) {
    // TODO: Integrate with real LLM provider using fetch when credentials exist.
    // Example sketch:
    // const response = await fetch(LLM_API_URL, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${LLM_API_KEY}`,
    //   },
    //   body: JSON.stringify({ summary: deptSummary, requests }),
    // });
    // const data = await response.json();
    // return data as RecommendationResponse;
  }

  return {
    recommendations: [
      {
        priority: "Increase TA hours for high-enrollment intro courses",
        category: "TA / Grader / Student Worker Support",
        rationale: "Many comments mention needing more support in office hours and recitations.",
      },
      {
        priority: "Upgrade classroom AV equipment in large lecture halls",
        category: "Classroom & Instructional Technology",
        rationale: "Multiple comments reference failing projectors and wasted class time.",
      },
      {
        priority: "Address overcrowding in key required courses",
        category: "Space, Furniture, & Facility Improvements",
        rationale: "Students mention difficulty asking questions and participating due to large class sizes.",
      },
    ],
    rankedRequests: requests.map((req, index) => {
      const pastDenialHint = buildDenialHint(req.category);
      return {
        id: req.id,
        priorityRank: index + 1,
        alignmentScore: Math.max(40, 90 - index * 5),
        reasoning: "Dummy ranking – replace with LLM-scored prioritization in production.",
        ...(pastDenialHint ? { pastDenialHint } : {}),
      };
    }),
  };
}

function buildDenialHint(category: FundingRequest["category"]): string | undefined {
  const [primaryReason] = getCommonDenialMessagesForCategory(category);
  if (!primaryReason) {
    return undefined;
  }
  return `Similar ${category} requests were denied: ${primaryReason}.`;
}

