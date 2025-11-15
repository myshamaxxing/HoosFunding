import type { RequestCategory } from "../types";

export const categoryFilters: (RequestCategory | "All")[] = [
  "All",
  "Professional Development & Training",
  "Conference Travel & Presentations",
  "Teaching Materials, Software, & Subscriptions",
  "Classroom & Instructional Technology",
  "TA / Grader / Student Worker Support",
  "Student Experience, Events, & Programming",
  "Space, Furniture, & Facility Improvements",
  "Research & Lab Equipment (mixed with teaching)",
  "Other",
];

export const categoryColors: Record<RequestCategory, string> = {
  "Professional Development & Training": "#2563eb",
  "Conference Travel & Presentations": "#f97316",
  "Teaching Materials, Software, & Subscriptions": "#10b981",
  "Classroom & Instructional Technology": "#a855f7",
  "TA / Grader / Student Worker Support": "#ec4899",
  "Student Experience, Events, & Programming": "#14b8a6",
  "Space, Furniture, & Facility Improvements": "#fbbf24",
  "Research & Lab Equipment (mixed with teaching)": "#8b5cf6",
  Other: "#64748b",
};

