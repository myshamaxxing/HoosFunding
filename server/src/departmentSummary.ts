import { DepartmentSummary } from "./types";

export const departmentSummary: DepartmentSummary = {
  departmentName: "Economics",
  avgResourcesRating: 3.2,
  avgTeachingRating: 4.1,
  topThemes: [
    { theme: "Need more TA support", count: 14 },
    { theme: "Broken or unreliable projectors / AV", count: 9 },
    { theme: "Overcrowded classes", count: 7 },
    { theme: "Difficulty accessing materials online", count: 5 },
  ],
  sampleComments: [
    "The professor was great but there was never enough TA support in office hours.",
    "The projector in our classroom kept failing and wasting class time.",
    "The room felt overcrowded and it was hard to ask questions.",
    "Canvas organization made it difficult to find assignments.",
    "Would appreciate more one-on-one help in recitations.",
  ],
};

