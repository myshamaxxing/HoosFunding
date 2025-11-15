import { FundingRequest } from "./types";

export const fundingRequests: FundingRequest[] = [
  {
    id: "req-1",
    name: "Jordan Alvarez",
    role: "Student",
    category: "Tech",
    title: "Replace failing projector in Monroe 120",
    description: "Projector constantly resets mid-lecture causing delays. Need upgrade before spring semester.",
    urgency: "High",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "Pending",
  },
  {
    id: "req-2",
    name: "Dr. Priya Raman",
    role: "Professor",
    category: "Staffing",
    title: "Additional TA for ECON 2010",
    description: "Enrollment up 30% and only 2 TAs assigned. Requesting one more graduate TA for recitations.",
    urgency: "Medium",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "Pending",
  },
];

