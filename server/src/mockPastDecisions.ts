import type { RequestCategory } from "./types";

export interface PastDecision {
  id: string;
  category: RequestCategory;
  description: string;
  decision: "Approved" | "Denied";
  reason: string;
}

export const mockPastDecisions: PastDecision[] = [
  {
    id: "pd-1",
    category: "Teaching Materials, Software, & Subscriptions",
    description: "Department-wide subscription to generic productivity suite",
    decision: "Denied",
    reason: "Must use central ITS licenses; request lacked per-course usage plan.",
  },
  {
    id: "pd-2",
    category: "Teaching Materials, Software, & Subscriptions",
    description: "Simulation software license tied to ECON 2020 with per-seat pricing",
    decision: "Approved",
    reason: "Clear course impact and vendor cost sharing.",
  },
  {
    id: "pd-3",
    category: "Classroom & Instructional Technology",
    description: "Replace projector in Monroe 120",
    decision: "Denied",
    reason: "Must route through central classroom support upgrade cycle.",
  },
  {
    id: "pd-4",
    category: "Classroom & Instructional Technology",
    description: "Accessibility microphone kit pilot",
    decision: "Approved",
    reason: "Supported ADA compliance with documented student need.",
  },
  {
    id: "pd-5",
    category: "TA / Grader / Student Worker Support",
    description: "Additional TA for course with 30% enrollment growth",
    decision: "Approved",
    reason: "Enrollment data and hours plan were provided.",
  },
  {
    id: "pd-6",
    category: "TA / Grader / Student Worker Support",
    description: "Request for grader without enrollment justification",
    decision: "Denied",
    reason: "No data showing increased workload or special needs.",
  },
  {
    id: "pd-7",
    category: "Conference Travel & Presentations",
    description: "Late travel request submitted 10 days before departure",
    decision: "Denied",
    reason: "Policy requires 30-day notice; external funding not exhausted.",
  },
  {
    id: "pd-8",
    category: "Conference Travel & Presentations",
    description: "Student travel grant for presenting department research",
    decision: "Approved",
    reason: "Clear alignment with departmental initiatives and co-funding.",
  },
  {
    id: "pd-9",
    category: "Space, Furniture, & Facility Improvements",
    description: "DIY furniture purchase for advising suite",
    decision: "Denied",
    reason: "Facilities must approve vendors and installation.",
  },
  {
    id: "pd-10",
    category: "Space, Furniture, & Facility Improvements",
    description: "Ergonomic chairs approved by Facilities",
    decision: "Approved",
    reason: "Came with Facilities quote and ergonomic justification.",
  },
  {
    id: "pd-11",
    category: "Research & Lab Equipment (mixed with teaching)",
    description: "High-end VR equipment primarily for research",
    decision: "Denied",
    reason: "Should be charged to grants; instructional use unclear.",
  },
  {
    id: "pd-12",
    category: "Student Experience, Events, & Programming",
    description: "Welcome week social with advisory programming",
    decision: "Approved",
    reason: "Clear student success outcomes and cost share.",
  },
  {
    id: "pd-13",
    category: "Professional Development & Training",
    description: "Individual leadership coaching",
    decision: "Denied",
    reason: "Should use HR budgets; lacked department-wide benefit.",
  },
  {
    id: "pd-14",
    category: "Conference Travel & Presentations",
    description: "Poster printing request only",
    decision: "Approved",
    reason: "Low cost and direct presentation support.",
  },
];

