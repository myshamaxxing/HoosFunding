import type {
  DepartmentSummary,
  FundingRequest,
  RecommendationResponse,
  ViabilityStatus,
  PolicyGreyArea,
} from "./types";
import {
  buildPreCheckMessage,
  getCommonDenialMessagesForCategory,
  getPolicyReferencesForCategory,
} from "./policyCategories";
import { mockPastDecisions } from "./mockPastDecisions";

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

  const greyAreaSuggestions = new Map<FundingRequest["category"], string>();

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
      const viability = evaluateViability(req, greyAreaSuggestions);
      return {
        id: req.id,
        priorityRank: index + 1,
        alignmentScore: Math.max(40, 90 - index * 5),
        reasoning: "Dummy ranking – replace with LLM-scored prioritization in production.",
        ...(pastDenialHint ? { pastDenialHint: applyPolicyCode(pastDenialHint, req.category) ?? undefined } : {}),
        viability: viability.status,
        ...(viability.policyNote
          ? { policyNote: applyPolicyCode(viability.policyNote, req.category) ?? undefined }
          : {}),
      };
    }),
    policyGreyAreas: Array.from(greyAreaSuggestions.entries()).map<PolicyGreyArea>(([category, suggestion]) => ({
      category,
      summary: `Policy interpretation for ${category} requests is inconsistent.`,
      suggestion,
    })),
  };
}

function buildDenialHint(category: FundingRequest["category"]): string | undefined {
  const [primaryReason] = getCommonDenialMessagesForCategory(category);
  if (!primaryReason) {
    return undefined;
  }
  return `Similar ${category} requests were denied: ${primaryReason}.`;
}

function evaluateViability(
  request: FundingRequest,
  greyAreaSuggestions: Map<FundingRequest["category"], string>,
): { status: ViabilityStatus; policyNote?: string } {
  const categoryDecisions = mockPastDecisions.filter((decision) => decision.category === request.category);
  const approvals = categoryDecisions.filter((decision) => decision.decision === "Approved").length;
  const total = categoryDecisions.length;
  const approvalRate = total > 0 ? approvals / total : 0.6;

  let status: ViabilityStatus;
  if (approvalRate >= 0.65) {
    status = "Likely";
  } else if (approvalRate >= 0.4) {
    status = "Needs Review";
  } else {
    status = "Risky";
  }

  const description = request.description.toLowerCase();
  const keywords = getCategoryKeywords(request.category);
  const keywordHit = keywords.some((word) => description.includes(word));
  const denialReasons = getCommonDenialMessagesForCategory(request.category);
  let policyNote: string | undefined = denialReasons[0];

  if (keywordHit) {
    status = status === "Likely" ? "Needs Review" : status;
    policyNote = buildPreCheckMessage(request.category);
  }

  if (status !== "Likely" && approvalRate > 0 && approvalRate < 0.7) {
    const existing = greyAreaSuggestions.get(request.category);
    if (!existing) {
      greyAreaSuggestions.set(
        request.category,
        `Approval rate is ${Math.round(approvalRate * 100)}% with frequent policy questions. Clarify guidance for ${request.category}.`,
      );
    }
  }

  const result: { status: ViabilityStatus; policyNote?: string } = { status };
  if (policyNote) {
    result.policyNote = policyNote;
  }
  return result;
}

function getCategoryKeywords(category: FundingRequest["category"]): string[] {
  const mapping: Record<FundingRequest["category"], string[]> = {
    "Professional Development & Training": ["workshop", "training", "certificate", "coaching"],
    "Conference Travel & Presentations": ["travel", "flight", "hotel", "conference", "poster", "last minute"],
    "Teaching Materials, Software, & Subscriptions": ["subscription", "license", "software", "platform", "saas"],
    "Classroom & Instructional Technology": ["projector", "camera", "av", "equipment", "hardware", "lecture"],
    "TA / Grader / Student Worker Support": ["ta", "grader", "assistant", "student worker"],
    "Student Experience, Events, & Programming": ["event", "program", "workshop", "catering", "student"],
    "Space, Furniture, & Facility Improvements": ["furniture", "renovation", "space", "room", "chairs", "facility"],
    "Research & Lab Equipment (mixed with teaching)": ["lab", "equipment", "research", "sensors", "vr"],
    Other: ["misc", "general"],
  };
  return mapping[category] ?? [];
}

function applyPolicyCode(note: string | undefined, category: FundingRequest["category"]): string | undefined {
  if (!note) return undefined;
  const references = getPolicyReferencesForCategory(category);
  if (!references.length) return note;
  const top = references[0];
  if (!top) return note;
  return `[${top.code}] ${note} (${top.url})`;
}

