import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import crypto from "node:crypto";

import { getFundingRecommendations } from "./aiService";
import { departmentSummary } from "./departmentSummary";
import { fundingRequests } from "./store";
import type { FundingRequest } from "./types";
import { buildPreCheckMessage, getCommonDenialMessagesForCategory } from "./policyCategories";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/department-summary", (_req: Request, res: Response) => {
  res.json(departmentSummary);
});

app.get("/api/requests", (_req: Request, res: Response) => {
  res.json(fundingRequests);
});

app.post("/api/requests", (req: Request, res: Response) => {
  const { name, email, role, category, title, description, urgency } = req.body ?? {};
  if (!name || !email || !role || !category || !title || !description || !urgency) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  if (!normalizedEmail.endsWith("@virginia.edu")) {
    return res.status(400).json({ error: "Email must end with @virginia.edu." });
  }

  const newRequest: FundingRequest = {
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    role,
    category,
    title,
    description,
    urgency,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  fundingRequests.unshift(newRequest);
  return res.status(201).json(newRequest);
});

app.post("/api/recommend", async (_req: Request, res: Response) => {
  try {
    const pendingRequests = fundingRequests.filter((req) => req.status === "Pending");
    const recommendations = await getFundingRecommendations(departmentSummary, pendingRequests);
    res.json(recommendations);
  } catch (error) {
    console.error("Failed to generate recommendations", error);
    res.status(500).json({ error: "Failed to generate recommendations." });
  }
});

app.post("/api/precheck-request", (req: Request, res: Response) => {
  const { category, description } = req.body ?? {};
  if (!category || !description) {
    return res.status(400).json({ error: "Category and description are required." });
  }
  const reasons = getCommonDenialMessagesForCategory(category);
  let message = buildPreCheckMessage(category);
  const normalizedDescription = String(description).toLowerCase();
  if (
    category === "Teaching Materials, Software, & Subscriptions" &&
    normalizedDescription.includes("subscription")
  ) {
    message =
      "⚠️ Reviewers often deny software subscriptions unless tied to a specific course with per-student licensing. Highlight how the subscription supports a class.";
  }
  if (category === "Conference Travel & Presentations" && normalizedDescription.includes("last minute")) {
    message =
      "⚠️ Travel funding frequently gets denied when submitted less than 30 days in advance. Add justification or confirm dates if possible.";
  }
  res.json({
    preCheckMessage: message,
    commonDenialReasons: reasons,
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`HoosFunding API running on http://localhost:${PORT}`);
});

