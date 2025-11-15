import type { RequestCategory } from "./types";

export interface CommonDenialReason {
  summary: string;
  details: string;
}

export interface CategoryPolicyInfo {
  displayName: string;
  exampleRequests: string[];
  commonDenialReasons: CommonDenialReason[];
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
      },
      {
        summary: "Individual vs program benefit",
        details: "Approvals prefer impact across multiple courses or staff members, not single-person enrichment.",
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
      },
      {
        summary: "Insufficient alignment",
        details: "Conference topics must clearly align with department priorities or teaching mission.",
      },
      {
        summary: "Late submission",
        details: "Requests submitted less than 30 days before travel are frequently denied.",
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
      },
      {
        summary: "Central IT ownership",
        details: "If ITS already licenses the software, departments cannot purchase redundant seats.",
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
      },
      {
        summary: "Insufficient justification",
        details: "Requests need data on class sizes, failure rates, or accessibility requirements.",
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
      },
      {
        summary: "Alternative funding required",
        details: "Graduate school or central academic affairs must be used before department funds.",
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
      },
      {
        summary: "Missing cost share",
        details: "Events typically need co-sponsorship or ticket revenue; fully-funded requests are often denied.",
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
      },
      {
        summary: "Capital vs operating funds",
        details: "Large purchases may need capital budget approval rather than unit-level operating funds.",
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
      },
      {
        summary: "Maintenance plan missing",
        details: "Requests without long-term support plans or consumable budgets are denied.",
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
      },
      {
        summary: "Should route elsewhere",
        details: "Some requests belong with HR, ITS, or central procurement rather than the department.",
      },
    ],
  },
};

export function getCommonDenialMessagesForCategory(category: RequestCategory): string[] {
  const info = CATEGORY_POLICY_INFO[category];
  return info.commonDenialReasons.map((reason) => `${reason.summary}: ${reason.details}`);
}

export function buildPreCheckMessage(category: RequestCategory): string {
  const info = CATEGORY_POLICY_INFO[category];
  const reasons = info.commonDenialReasons;
  if (reasons.length === 0) {
    return "⚠️ Reviewers expect detailed justification for this category. Provide context on impact, cost, and alignment.";
  }
  const reason = reasons[0];
  if (!reason) {
    return "⚠️ Reviewers expect detailed justification for this category. Provide context on impact, cost, and alignment.";
  }
  return `⚠️ Past requests in ${info.displayName} were often denied because ${reason.details} To improve your chances, address this concern directly.`;
}

