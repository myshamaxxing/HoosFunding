import type { RequestCategory } from "./types";

export interface PastDecision {
  id: string;
  category: RequestCategory;
  description: string;
  decision: "Approved" | "Denied";
  reason: string;
  policyCode?: string;
  referenceUrl?: string;
}

export const mockPastDecisions: PastDecision[] = [
  {
    id: "pd-1",
    category: "Teaching Materials, Software, & Subscriptions",
    description: "Department-wide subscription to generic productivity suite",
    decision: "Denied",
    reason: "Must use central ITS licenses; request lacked per-course usage plan.",
    policyCode: "FIN-030",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-030",
  },
  {
    id: "pd-2",
    category: "Teaching Materials, Software, & Subscriptions",
    description: "Simulation software license tied to ECON 2020 with per-seat pricing",
    decision: "Approved",
    reason: "Clear course impact and vendor cost sharing.",
    policyCode: "FIN-030",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-030",
  },
  {
    id: "pd-3",
    category: "Classroom & Instructional Technology",
    description: "Replace projector in Monroe 120",
    decision: "Denied",
    reason: "Must route through central classroom support upgrade cycle.",
    policyCode: "FIN-038",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-038",
  },
  {
    id: "pd-4",
    category: "Classroom & Instructional Technology",
    description: "Accessibility microphone kit pilot",
    decision: "Approved",
    reason: "Supported ADA compliance with documented student need.",
    policyCode: "FIN-030",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-030",
  },
  {
    id: "pd-5",
    category: "TA / Grader / Student Worker Support",
    description: "Additional TA for course with 30% enrollment growth",
    decision: "Approved",
    reason: "Enrollment data and hours plan were provided.",
    policyCode: "Budget Management",
    referenceUrl: "https://uvafinance.virginia.edu/budget-management",
  },
  {
    id: "pd-6",
    category: "TA / Grader / Student Worker Support",
    description: "Request for grader without enrollment justification",
    decision: "Denied",
    reason: "No data showing increased workload or special needs.",
    policyCode: "Budget Portal",
    referenceUrl: "https://suppliers.uvafinance.virginia.edu/resources/budget-portal",
  },
  {
    id: "pd-7",
    category: "Conference Travel & Presentations",
    description: "Late travel request submitted 10 days before departure",
    decision: "Denied",
    reason: "Policy requires 30-day notice; external funding not exhausted.",
    policyCode: "FIN-004",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-004",
  },
  {
    id: "pd-8",
    category: "Conference Travel & Presentations",
    description: "Student travel grant for presenting department research",
    decision: "Approved",
    reason: "Clear alignment with departmental initiatives and co-funding.",
    policyCode: "FIN-004",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-004",
  },
  {
    id: "pd-9",
    category: "Space, Furniture, & Facility Improvements",
    description: "DIY furniture purchase for advising suite",
    decision: "Denied",
    reason: "Facilities must approve vendors and installation.",
    policyCode: "FIN-030",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-030",
  },
  {
    id: "pd-10",
    category: "Space, Furniture, & Facility Improvements",
    description: "Ergonomic chairs approved by Facilities",
    decision: "Approved",
    reason: "Came with Facilities quote and ergonomic justification.",
    policyCode: "FIN-038",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-038",
  },
  {
    id: "pd-11",
    category: "Research & Lab Equipment (mixed with teaching)",
    description: "High-end VR equipment primarily for research",
    decision: "Denied",
    reason: "Should be charged to grants; instructional use unclear.",
    policyCode: "FIN-015",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-015",
  },
  {
    id: "pd-12",
    category: "Student Experience, Events, & Programming",
    description: "Welcome week social with advisory programming",
    decision: "Approved",
    reason: "Clear student success outcomes and cost share.",
    policyCode: "Budgeting Guidance",
    referenceUrl: "https://uvafinance.virginia.edu/budget-management/budgeting",
  },
  {
    id: "pd-13",
    category: "Professional Development & Training",
    description: "Individual leadership coaching",
    decision: "Denied",
    reason: "Should use HR budgets; lacked department-wide benefit.",
    policyCode: "Education Benefits (HR)",
    referenceUrl: "https://hr.virginia.edu/career-development/education-benefits-0",
  },
  {
    id: "pd-14",
    category: "Conference Travel & Presentations",
    description: "Poster printing request only",
    decision: "Approved",
    reason: "Low cost and direct presentation support.",
    policyCode: "FIN-004",
    referenceUrl: "https://uvapolicy.virginia.edu/policy/FIN-004",
  },
];

