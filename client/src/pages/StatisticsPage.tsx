import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { fetchPolicyInsights, fetchRecommendations, fetchRequests } from "../api";
import type {
  FundingRequest,
  PolicyInsightSummary,
  RecommendationResponse,
  RequestCategory,
} from "../types";
import { categoryColors } from "../constants/categoryMetadata";
import { InfoHint } from "../components/InfoHint";

export function StatisticsPage() {
  const [requests, setRequests] = useState<FundingRequest[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [policyInsights, setPolicyInsights] = useState<PolicyInsightSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const [requestData, recData, insightData] = await Promise.all([
          fetchRequests(),
          fetchRecommendations(),
          fetchPolicyInsights(),
        ]);
        setRequests(requestData);
        setRecommendations(recData);
        setPolicyInsights(insightData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const chartData = useMemo(() => {
    const counts: Record<RequestCategory, number> = {
      "Professional Development & Training": 0,
      "Conference Travel & Presentations": 0,
      "Teaching Materials, Software, & Subscriptions": 0,
      "Classroom & Instructional Technology": 0,
      "TA / Grader / Student Worker Support": 0,
      "Student Experience, Events, & Programming": 0,
      "Space, Furniture, & Facility Improvements": 0,
      "Research & Lab Equipment (mixed with teaching)": 0,
      Other: 0,
    };
    requests.forEach((request) => {
      counts[request.category] += 1;
    });
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([category, count]) => ({ name: category, value: count }));
  }, [requests]);

  const requestSummary = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((req) => req.status === "Pending").length;
    const approved = requests.filter((req) => req.status === "Approved").length;
    const denied = requests.filter((req) => req.status === "Denied").length;
    return { total, pending, approved, denied };
  }, [requests]);

  const highAlignment = useMemo(() => {
    if (!recommendations) return [];
    return recommendations.rankedRequests
      .filter((req) => req.alignmentScore >= 80)
      .slice(0, 3)
      .map((req) => ({
        id: req.id,
        score: req.alignmentScore,
        rationale: req.reasoning,
      }));
  }, [recommendations]);

  const modelInputs = [
    {
      title: "Department Signal",
      detail:
        "server/departmentSummary.ts supplies strategic priorities that influence recommendation ordering.",
    },
    {
      title: "Mock Past Decisions",
      detail:
        "server/mockPastDecisions.ts captures historical approvals/denials plus policy codes for viability scoring.",
    },
    {
      title: "Policy Knowledge Base",
      detail:
        "server/policyCategories.ts + policyInsights.ts define denial reasons and reference URLs to ground hints.",
    },
    {
      title: "Live Pending Requests",
      detail: "server/store.ts feeds the latest submissions that the AI ranks and annotates.",
    },
  ];

  const deploymentSteps = [
    "Run `npm install && npm run dev` in /client for the Vite React UI.",
    "Run `npm install && npm run dev` in /server to start the Express API with mock data.",
    "Set LLM_API_URL and LLM_API_KEY env vars if replacing the heuristic model in server/src/aiService.ts.",
    "Containerize both apps or deploy separately (e.g., Render/Fly.io for server, Netlify/Vercel for client) and point VITE_API_BASE_URL to the hosted API.",
  ];

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Request Statistics & AI Overview</h2>
        <p className="mt-2 text-sm text-slate-600">
          Explore how funding requests break down by category, understand where policy ambiguity exists, and review how
          the embedded AI model was trained and how to ship it.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Crunching the latest numbers…</p>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Request Volume</h3>
                  <p className="text-xs text-slate-500">Totals from the current mock data store.</p>
                </div>
                <InfoHint label="Request volume" text="Counts update whenever the mock store changes." />
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <StatPill label="Total" value={requestSummary.total} />
                <StatPill label="Pending" value={requestSummary.pending} />
                <StatPill label="Approved" value={requestSummary.approved} />
                <StatPill label="Denied" value={requestSummary.denied} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-semibold text-slate-900">Requests by Category</h4>
                  <InfoHint
                    label="Requests by category"
                    text="Displays the share of requests inside each funding track."
                  />
                </div>
                {chartData.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-500">No requests captured yet.</p>
                ) : (
                  <div className="mt-4 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie dataKey="value" data={chartData} innerRadius={60} outerRadius={90} paddingAngle={4}>
                          {chartData.map((entry) => (
                            <Cell key={entry.name} fill={categoryColors[entry.name as RequestCategory]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">AI High-Confidence Picks</h3>
                <InfoHint
                  label="High-confidence"
                  text="Requests where alignment score ≥ 80 based on heuristic features."
                />
              </div>
              {highAlignment.length === 0 ? (
                <p className="text-sm text-slate-500">Run a few recommendations to populate this list.</p>
              ) : (
                <ul className="space-y-3 text-sm text-slate-600">
                  {highAlignment.map((item) => (
                    <li key={item.id} className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                      <p className="text-sm font-semibold text-primary">Score {item.score}</p>
                      <p className="text-xs text-slate-500">{item.rationale}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {recommendations?.policyGreyAreas.length ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">Policy Grey Areas</h3>
                <InfoHint
                  label="Policy grey areas"
                  text="Categories where approvals vs. denials are inconsistent and need clarification."
                />
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                {recommendations.policyGreyAreas.map((area) => (
                  <li key={area.category} className="rounded-xl border border-slate-100 p-4">
                    <p className="text-sm font-semibold text-slate-900">{area.category}</p>
                    <p className="text-xs text-slate-500">{area.summary}</p>
                    <p className="mt-1 text-xs text-slate-500">{area.suggestion}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {policyInsights && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">Category Approval Trends</h3>
                <InfoHint
                  label="Category approval trends"
                  text="Historical approvals vs. denials sourced from mock past decisions."
                />
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead>
                    <tr className="text-xs uppercase text-slate-500">
                      <th className="py-2">Category</th>
                      <th className="py-2">Approvals</th>
                      <th className="py-2">Denials</th>
                      <th className="py-2">Approval Rate</th>
                      <th className="py-2">Top Denial Reasons</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policyInsights.categories.map((cat) => (
                      <tr key={cat.category} className="border-t border-slate-100">
                        <td className="py-2 font-medium text-slate-900">{cat.category}</td>
                        <td className="py-2">{cat.approvals}</td>
                        <td className="py-2">{cat.denials}</td>
                        <td className="py-2">{Math.round(cat.approvalRate * 100)}%</td>
                        <td className="py-2 text-xs text-slate-500">
                          {cat.topReasons.length ? cat.topReasons.join("; ") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">AI Model & Training Notes</h3>
              <InfoHint
                label="Model training"
                text="Summarizes the heuristics currently powering aiService.ts."
              />
            </div>
            <p className="mt-2 text-sm text-slate-600">
              The current model is a rules-based scaffold ready for an LLM callout. It blends policy metadata with past
              decisions to emulate a reviewer. Here is the exact training corpus:
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {modelInputs.map((input) => (
                <li key={input.title} className="rounded-xl border border-slate-100 p-3">
                  <p className="text-sm font-semibold text-slate-900">{input.title}</p>
                  <p className="text-xs text-slate-500">{input.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
}

interface StatPillProps {
  label: string;
  value: number;
}

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

