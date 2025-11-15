import type { RequestCategory } from "./types";

export interface PolicyReference {
  code: string;
  summary: string;
  url: string;
}

export interface CommonDenialReason {
  summary: string;
  details: string;
  policyCode?: string;
  referenceUrl?: string;
}

export interface CategoryPolicyInfo {
  displayName: string;
  exampleRequests: string[];
  commonDenialReasons: CommonDenialReason[];
  policyReferences: PolicyReference[];
}

export const CATEGORY_POLICY_INFO: Record<RequestCategory, CategoryPolicyInfo> = {
  "Professional Development & Training": {
    displayName: "Professional Development & Training",
    exampleRequests: [
      "Virtual workshop for instructional design",
      "Course-specific certification exam reimbursements",
    ],
    commonDenialReasons: [
      {
        summary: "Wrong funding source",
        details: "Requests routed here often should go to HR or another central professional development budget.",
        policyCode: "Education Benefits (HR)",
        referenceUrl: "https://hr.virginia.edu/career-development/education-benefits-0",
      },
      {
        summary: "Individual vs program benefit",
        details: "Approvals prefer impact across multiple courses or staff members, not single-person enrichment.",
        policyCode: "Professional Development FAQ",
        referenceUrl: "https://uvafinance.virginia.edu/resources/professional-development-faqs",
      },
    ],
    policyReferences: [
      {
        code: "Education Benefits (HR)",
        summary: "Central HR tuition and development benefits must be used before unit funds.",
        url: "https://hr.virginia.edu/career-development/education-benefits-0",
      },
      {
        code: "Professional Development FAQ",
        summary: "Finance guidance on allowable professional development expenses and approvals.",
        url: "https://uvafinance.virginia.edu/resources/professional-development-faqs",
      },
    ],
  },
  "Conference Travel & Presentations": {
    displayName: "Conference Travel & Presentations",
    exampleRequests: ["Travel stipend to present at AEA", "Poster printing for academic conference"],
    commonDenialReasons: [
      {
        summary: "External funding available",
        details: "Departments expect faculty to exhaust school-level travel funds or grant budgets first.",
        policyCode: "FIN-004",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-004",
      },
      {
        summary: "Insufficient alignment",
        details: "Conference topics must clearly align with department priorities or teaching mission.",
        policyCode: "FIN-004",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-004",
      },
      {
        summary: "Late submission",
        details: "Requests submitted less than 30 days before travel are frequently denied.",
        policyCode: "FIN-004",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-004",
      },
    ],
    policyReferences: [
      {
        code: "FIN-004",
        summary: "Travel, meals, and entertainment expenses must follow advance-approval and documentation standards.",
        url: "https://uvapolicy.virginia.edu/policy/FIN-004",
      },
    ],
  },
  "Teaching Materials, Software, & Subscriptions": {
    displayName: "Teaching Materials, Software, & Subscriptions",
    exampleRequests: [
      "Per-course license for simulation tool",
      "Digital textbook access codes",
      "Custom case study packets",
    ],
    commonDenialReasons: [
      {
        summary: "Subscription vs per-course licensing",
        details: "General-purpose subscriptions are denied; approvals require clear per-course usage and cost sharing.",
        policyCode: "FIN-030",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-030",
      },
      {
        summary: "Central IT ownership",
        details: "If ITS already licenses the software, departments cannot purchase redundant seats.",
        policyCode: "FIN-038",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-038",
      },
    ],
    policyReferences: [
      {
        code: "FIN-030",
        summary: "Purchasing of goods and services must comply with procurement thresholds and approved suppliers.",
        url: "https://uvapolicy.virginia.edu/policy/FIN-030",
      },
      {
        code: "FIN-038",
        summary: "Receiving goods/services requires documentation before disbursement of university funds.",
        url: "https://uvapolicy.virginia.edu/policy/FIN-038",
      },
    ],
  },
  "Classroom & Instructional Technology": {
    displayName: "Classroom & Instructional Technology",
    exampleRequests: ["Lecture capture cameras", "New projectors", "Interactive whiteboards"],
    commonDenialReasons: [
      {
        summary: "Must go through facilities/IT",
        details: "Hardware upgrades usually require central Classroom Support approval and funding.",
        policyCode: "FIN-030",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-030",
      },
      {
        summary: "Insufficient justification",
        details: "Requests need data on class sizes, failure rates, or accessibility requirements.",
        policyCode: "FIN-038",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-038",
      },
    ],
    policyReferences: [
      {
        code: "FIN-030",
        summary: "Capital equipment purchases must follow procurement rules and approved vendor contracts.",
        url: "https://uvapolicy.virginia.edu/policy/FIN-030",
      },
      {
        code: "FIN-038",
        summary: "Equipment receiving must be documented prior to vendor payment.",
        url: "https://uvapolicy.virginia.edu/policy/FIN-038",
      },
    ],
  },
  "TA / Grader / Student Worker Support": {
    displayName: "TA / Grader / Student Worker Support",
    exampleRequests: ["Additional TA for ECON 2010", "Hourly grader for new course"],
    commonDenialReasons: [
      {
        summary: "Not tied to enrollment",
        details: "Requests must show enrollment growth or special instructional needs.",
        policyCode: "Budget Management",
        referenceUrl: "https://uvafinance.virginia.edu/budget-management",
      },
      {
        summary: "Alternative funding required",
        details: "Graduate school or central academic affairs must be used before department funds.",
        policyCode: "Budget Portal Guidance",
        referenceUrl: "https://suppliers.uvafinance.virginia.edu/resources/budget-portal",
      },
    ],
    policyReferences: [
      {
        code: "Budget Management",
        summary: "Budget office guidance requires staffing requests to align with enrollment drivers.",
        url: "https://uvafinance.virginia.edu/budget-management",
      },
      {
        code: "Budget Portal",
        summary: "New funding requests must follow budget portal instructions and central approvals.",
        url: "https://suppliers.uvafinance.virginia.edu/resources/budget-portal",
      },
    ],
  },
  "Student Experience, Events, & Programming": {
    displayName: "Student Experience, Events, & Programming",
    exampleRequests: ["Welcome reception catering", "Career workshop supplies"],
    commonDenialReasons: [
      {
        summary: "Non-mission programming",
        details: "Events must directly support academic success or advising outcomes.",
        policyCode: "Budget Management",
        referenceUrl: "https://uvafinance.virginia.edu/budget-management/budgeting",
      },
      {
        summary: "Missing cost share",
        details: "Events typically need co-sponsorship or ticket revenue; fully-funded requests are often denied.",
        policyCode: "FIN-004",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-004",
      },
    ],
    policyReferences: [
      {
        code: "Budgeting Guidance",
        summary: "Budget office requires linkage to student success metrics for discretionary spending.",
        url: "https://uvafinance.virginia.edu/budget-management/budgeting",
      },
      {
        code: "FIN-004",
        summary: "Hospitality and event expenses must follow the travel & entertainment policy.",
        url: "https://uvapolicy.virginia.edu/policy/FIN-004",
      },
    ],
  },
  "Space, Furniture, & Facility Improvements": {
    displayName: "Space, Furniture, & Facility Improvements",
    exampleRequests: ["Ergonomic chairs for advising suite", "Partition walls for study room"],
    commonDenialReasons: [
      {
        summary: "Facilities approval required",
        details: "Renovations and furniture purchases must be coordinated through Facilities Management.",
        policyCode: "FIN-030",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-030",
      },
      {
        summary: "Capital vs operating funds",
        details: "Large purchases may need capital budget approval rather than unit-level operating funds.",
        policyCode: "FIN-038",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-038",
      },
    ],
    policyReferences: [
      {
        code: "FIN-030",
        summary: "Capital and furniture purchases must go through Procurement/Facilities channels.",
        url: "https://uvapolicy.virginia.edu/policy/FIN-030",
      },
      {
        code: "FIN-038",
        summary: "Facilities improvements require receiving/inspection before payment.",
        url: "https://uvapolicy.virginia.edu/policy/FIN-038",
      },
    ],
  },
  "Research & Lab Equipment (mixed with teaching)": {
    displayName: "Research & Lab Equipment",
    exampleRequests: ["Shared VR lab equipment", "Data collection sensors for instruction"],
    commonDenialReasons: [
      {
        summary: "Primarily research",
        details: "Items used mainly for research must be charged to grants, not teaching budgets.",
        policyCode: "FIN-015",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-015",
      },
      {
        summary: "Maintenance plan missing",
        details: "Requests without long-term support plans or consumable budgets are denied.",
        policyCode: "EXT-009",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/EXT-009",
      },
    ],
    policyReferences: [
      {
        code: "FIN-015",
        summary: "Endowment and capital gift agreements prescribe allowable uses for mixed research purchases.",
        url: "https://uvapolicy.virginia.edu/policy/FIN-015",
      },
      {
        code: "EXT-009",
        summary: "Establishment of funds from gifts dictates when restricted funds can cover equipment.",
        url: "https://uvapolicy.virginia.edu/policy/EXT-009",
      },
    ],
  },
  Other: {
    displayName: "Other Requests",
    exampleRequests: ["Anything that does not fit above categories"],
    commonDenialReasons: [
      {
        summary: "Insufficient details",
        details: "Approvers need a clear link to instructional or student success outcomes.",
        policyCode: "Finance & Business Ops Index",
        referenceUrl: "https://uvapolicy.virginia.edu/category/finance-and-business-operations?page=1",
      },
      {
        summary: "Should route elsewhere",
        details: "Some requests belong with HR, ITS, or central procurement rather than the department.",
        policyCode: "FIN-030",
        referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-030",
      },
    ],
    policyReferences: [
      {
        code: "Finance & Business Ops Index",
        summary: "Use the UVA policy directory to determine the correct policy owner before submitting ad-hoc funding requests.",
        url: "https://uvapolicy.virginia.edu/category/finance-and-business-operations?page=1",
      },
    ],
  },
};

export function getDenialReasonObjects(category: RequestCategory): CommonDenialReason[] {
  return CATEGORY_POLICY_INFO[category]?.commonDenialReasons ?? [];
}

export function getCommonDenialMessagesForCategory(category: RequestCategory): string[] {
  return getDenialReasonObjects(category).map(formatDenialReason);
}

export function buildPreCheckMessage(category: RequestCategory): string {
  const info = CATEGORY_POLICY_INFO[category];
  const reason = getDenialReasonObjects(category)[0];
  if (!info || !reason) {
    return "⚠️ Reviewers expect detailed justification for this category. Provide context on impact, cost, and alignment.";
  }
  const policyTag = reason.policyCode ? `${reason.policyCode}: ` : "";
  return `⚠️ ${policyTag}${reason.details} Address this in your justification to improve approval odds.`;
}

export function getPolicyReferencesForCategory(category: RequestCategory): PolicyReference[] {
  return CATEGORY_POLICY_INFO[category]?.policyReferences ?? [];
}

function formatDenialReason(reason: CommonDenialReason): string {
  const tag = reason.policyCode ? `[${reason.policyCode}] ` : "";
  const link = reason.referenceUrl ? ` (${reason.referenceUrl})` : "";
  return `${tag}${reason.summary}: ${reason.details}${link}`;
}

