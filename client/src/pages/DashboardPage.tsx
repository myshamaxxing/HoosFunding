import { useEffect, useMemo, useState } from "react";
import { fetchRecommendations, fetchRequests } from "../api";
import type { FundingRequest, RecommendationResponse, RequestCategory } from "../types";
import { categoryFilters } from "../constants/categoryMetadata";
import { InfoHint } from "../components/InfoHint";

function extractPolicyCode(note: string): string | undefined {
  const match = note.match(/\[(?<code>FIN-\d+|EXT-\d+|Budget[^\]]+)\]/);
  return match?.groups?.code;
}

export function DashboardPage() {
  const [requests, setRequests] = useState<FundingRequest[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<RequestCategory | "All">("All");
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const adminName = import.meta.env.VITE_ADMIN_NAME ?? "Admin";

  useEffect(() => {
    async function bootstrap() {
      try {
        setError(null);
        const requestData = await fetchRequests();
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
    const map: Record<
      string,
      { hint?: string; policyCode?: string; viability: string; alignmentScore: number }
    > = {};
    recommendations.rankedRequests.forEach((ranked) => {
      const note = ranked.policyNote ?? ranked.pastDenialHint;
      map[ranked.id] = {
        hint: note,
        policyCode: note ? extractPolicyCode(note) : undefined,
        viability: ranked.viability,
        alignmentScore: ranked.alignmentScore,
      };
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

      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-200">Welcome</p>
          <h2 className="text-4xl font-semibold leading-tight text-white">Hello, {adminName}</h2>
          <p className="text-lg font-medium text-blue-100">Funding Management Portal</p>
          <div className="mt-2 inline-flex flex-col self-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-left">
            <span className="text-xs uppercase tracking-wide text-blue-100">Pending in queue</span>
            <span className="text-3xl font-semibold text-white">
              {requests.filter((req) => req.status === "Pending").length}
            </span>
          </div>
        </div>
      </div>

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
              filteredRequests.map((request) => {
                const insight = rankedHintsById[request.id];
                return (
                  <article key={request.id} className="rounded-xl border border-slate-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{request.title}</p>
                        <p className="text-xs text-slate-500">{request.role}</p>
                      </div>
                      <div className="text-right">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {request.category}
                        </span>
                        {insight && (
                          <span
                            className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                              insight.viability === "Likely"
                                ? "bg-emerald-100 text-emerald-700"
                                : insight.viability === "Needs Review"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {insight.viability}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Urgency: <span className="font-medium text-slate-700">{request.urgency}</span>
                      {insight ? ` • Alignment ${insight.alignmentScore}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{request.description}</p>
                    {insight?.hint && (
                      <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-900">
                        {insight.hint}
                        {insight.policyCode && (
                          <span className="ml-1 text-[10px] uppercase tracking-wide">({insight.policyCode})</span>
                        )}
                      </p>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
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

