import { CATEGORY_POLICY_INFO, getDenialReasonObjects } from "./policyCategories";
import { mockPastDecisions } from "./mockPastDecisions";
import type { CategoryInsight, PolicyInsightSummary, PolicyGreyArea, RequestCategory } from "./types";

export function buildPolicyInsights(): PolicyInsightSummary {
  const byCategory = new Map<RequestCategory, CategoryInsight>();

  mockPastDecisions.forEach((decision) => {
    const existing = byCategory.get(decision.category) ?? {
      category: decision.category,
      approvals: 0,
      denials: 0,
      approvalRate: 0,
      topReasons: [],
    };
    if (decision.decision === "Approved") {
      existing.approvals += 1;
    } else {
      existing.denials += 1;
      existing.topReasons = upsertReason(existing.topReasons, formatReason(decision.reason, decision.policyCode));
    }
    existing.approvalRate = calculateRate(existing.approvals, existing.denials);
    byCategory.set(decision.category, existing);
  });

  const frequentGreyAreas: PolicyGreyArea[] = [];
  byCategory.forEach((insight) => {
    if (insight.approvalRate > 0 && insight.approvalRate < 0.7) {
      frequentGreyAreas.push({
        category: insight.category,
        summary: `Approval rate ${Math.round(insight.approvalRate * 100)}% indicates inconsistent application of policy.`,
        suggestion: buildSuggestion(insight.category),
      });
    }
  });

  return {
    categories: Array.from(byCategory.values()).sort((a, b) => a.category.localeCompare(b.category)),
    frequentGreyAreas,
  };
}

function calculateRate(approvals: number, denials: number): number {
  const total = approvals + denials;
  if (total === 0) return 0;
  return approvals / total;
}

function upsertReason(reasons: string[], reason: string): string[] {
  if (reasons.includes(reason)) {
    return reasons;
  }
  const next = [...reasons, reason];
  return next.slice(0, 3);
}

function formatReason(reason: string, policyCode?: string): string {
  return policyCode ? `[${policyCode}] ${reason}` : reason;
}

function buildSuggestion(category: RequestCategory): string {
  const info = CATEGORY_POLICY_INFO[category];
  if (!info) return "Clarify criteria and documentation requirements.";
  const ref = info.policyReferences[0];
  if (!ref) {
    const commonReason = getDenialReasonObjects(category)[0];
    return commonReason?.details ?? "Clarify criteria and documentation requirements.";
  }
  return `Review ${ref.code} guidance (${ref.url}) to clarify approval standards for ${info.displayName}.`;
}

