import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { fetchDepartmentSummary, fetchRecommendations, fetchRequests } from "../api";
import type {
  DepartmentSummary,
  FundingRequest,
  RecommendationResponse,
  RequestCategory,
} from "../types";

const categoryFilters: (RequestCategory | "All")[] = [
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

const categoryColors: Record<RequestCategory, string> = {
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

function InfoHint({ text, label }: { text: string; label: string }) {
  return (
    <span
      className="cursor-help text-base text-slate-400"
      title={text}
      role="img"
      aria-label={`${label} info`}
    >
      ⓘ
    </span>
  );
}

export function DashboardPage() {
  const [requests, setRequests] = useState<FundingRequest[]>([]);
  const [department, setDepartment] = useState<DepartmentSummary | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<RequestCategory | "All">("All");
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        setError(null);
        const [summaryData, requestData] = await Promise.all([
          fetchDepartmentSummary(),
          fetchRequests(),
        ]);
        setDepartment(summaryData);
        setRequests(requestData);
        await generateRecommendations();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data.");
      }
    }
    bootstrap();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (request) => request.status === "Pending" && (categoryFilter === "All" || request.category === categoryFilter),
    );
  }, [requests, categoryFilter]);

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

  async function generateRecommendations() {
    try {
      setLoadingRecommendations(true);
      const data = await fetchRecommendations();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get recommendations.");
    } finally {
      setLoadingRecommendations(false);
    }
  }

  const rankedHintsById = useMemo(() => {
    if (!recommendations) return {};
    const map: Record<string, string | undefined> = {};
    recommendations.rankedRequests.forEach((ranked) => {
      map[ranked.id] = ranked.pastDenialHint;
    });
    return map;
  }, [recommendations]);

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">View Pending Requests</h3>
                <InfoHint
                  label="Pending requests"
                  text="Shows every open request awaiting review. Use filters to focus on a category."
                />
              </div>
              <p className="text-xs text-slate-500">Filter to focus on specific request types.</p>
            </div>
            <select
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as RequestCategory | "All")}
            >
              {categoryFilters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3 max-h-[36rem] overflow-auto pr-1">
            {filteredRequests.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                No requests match this filter yet.
              </p>
            ) : (
              filteredRequests.map((request) => (
                <article key={request.id} className="rounded-xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{request.title}</p>
                    <span
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                      aria-label={`Category ${request.category}`}
                    >
                      {request.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {request.role} • Urgency: <span className="font-medium text-slate-700">{request.urgency}</span>
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{request.description}</p>
                  {rankedHintsById[request.id] && (
                    <p className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      <span className="font-semibold">AI Policy Insight:</span> {rankedHintsById[request.id]}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">Requests by Category</h3>
              <InfoHint
                label="Requests by category"
                text="Quick snapshot of how many requests fall into each funding category."
              />
            </div>
            {chartData.length === 0 ? (
              <p className="mt-6 rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                No requests yet.
              </p>
            ) : (
              <div className="mt-4 h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" data={chartData} innerRadius={50} outerRadius={80} paddingAngle={4}>
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

          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">AI Recommendations</h3>
                  <InfoHint
                    label="AI recommendations"
                    text="Summarizes the top funding priorities suggested by the AI model."
                  />
                </div>
                <p className="text-xs text-slate-500">Combines department summary + pending requests.</p>
              </div>
              <button
                type="button"
                onClick={generateRecommendations}
                className="rounded-full border border-primary bg-white px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white"
              >
                Refresh
              </button>
            </div>

            {loadingRecommendations ? (
              <p className="text-sm text-slate-500">Generating insights...</p>
            ) : recommendations ? (
              <div className="space-y-4">
                <ul className="space-y-3">
                  {recommendations.recommendations.map((item) => (
                    <li key={item.priority} className="rounded-xl border border-slate-100 p-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">{item.priority}</p>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{item.rationale}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recommendations yet.</p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">AI Ranking</h3>
              <InfoHint
                label="AI ranking"
                text="Requests ordered by how strongly they align with current department needs."
              />
            </div>
            {recommendations ? (
              <ul className="mt-3 space-y-2">
                {recommendations.rankedRequests.slice(0, 4).map((item) => {
                  const request = requests.find((req) => req.id === item.id);
                  return (
                    <li key={item.id} className="rounded-lg border border-slate-100 p-3 text-sm text-slate-600">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Rank #{item.priorityRank}</span>
                        <span>Alignment {item.alignmentScore}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {request?.title ?? "Request"}
                      </p>
                      <p className="text-xs text-slate-500">{item.reasoning}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Ranking will appear once recommendations load.</p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">Top AI-Flagged Requests</h3>
              <InfoHint
                label="Top AI-flagged"
                text="Highest-priority individual requests surfaced by the AI (alignment score ≥ 80)."
              />
            </div>
            {recommendations ? (
              (() => {
                const topFlagged =
                  recommendations.rankedRequests.filter((req) => req.alignmentScore >= 80).slice(0, 3) ||
                  [];
                const fallback = topFlagged.length > 0 ? topFlagged : recommendations.rankedRequests.slice(0, 3);
                return (
                  <ul className="mt-3 space-y-3">
                    {fallback.map((item) => {
                      const request = requests.find((req) => req.id === item.id);
                      return (
                        <li key={item.id} className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                          <p className="text-sm font-semibold text-primary">
                            {request?.title ?? "Request"} (Score {item.alignmentScore})
                          </p>
                          <p className="text-xs text-slate-600">{item.reasoning}</p>
                        </li>
                      );
                    })}
                  </ul>
                );
              })()
            ) : (
              <p className="mt-4 text-sm text-slate-500">AI needs a moment to flag high-priority requests.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

