import { useEffect, useMemo, useState } from "react";
import { createRequest, fetchRecommendations, fetchRequests } from "../api";
import type { FundingRequest, NewFundingRequest, RecommendationResponse } from "../types";

const quickFormDefaults: NewFundingRequest = {
  name: "Demo User",
  email: "demo@virginia.edu",
  role: "Student",
  category: "Professional Development & Training",
  title: "",
  description: "",
  urgency: "Medium",
};

export function RequesteeDashboardPage() {
  const [requests, setRequests] = useState<FundingRequest[]>([]);
  const [recData, setRecData] = useState<RecommendationResponse | null>(null);
  const [quickForm, setQuickForm] = useState(quickFormDefaults);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [viewEmail, setViewEmail] = useState(quickFormDefaults.email);

  const filteredRequests = useMemo(() => {
    const normalized = viewEmail.toLowerCase();
    return requests.filter((req) => req.email.toLowerCase() === normalized);
  }, [requests, viewEmail]);

  const pending = useMemo(
    () => filteredRequests.filter((req) => req.status === "Pending"),
    [filteredRequests],
  );
  const processed = useMemo(
    () => filteredRequests.filter((req) => req.status !== "Pending"),
    [filteredRequests],
  );
  const hintsById = useMemo(() => {
    if (!recData) return {};
    const map: Record<string, string | undefined> = {};
    recData.rankedRequests.forEach((ranked) => {
      map[ranked.id] = ranked.policyNote ?? ranked.pastDenialHint;
    });
    return map;
  }, [recData]);

  useEffect(() => {
    async function load() {
      const [reqs, recs] = await Promise.all([fetchRequests(), fetchRecommendations()]);
      setRequests(reqs);
      setRecData(recs);
    }
    load();
  }, []);

  useEffect(() => {
    setQuickForm((prev) => ({ ...prev, email: viewEmail }));
  }, [viewEmail]);

  async function handleQuickSubmit() {
    setSubmitting(true);
    setMessage(null);
    try {
      const created = await createRequest(quickForm);
      setRequests((prev) => [created, ...prev]);
      setQuickForm({ ...quickFormDefaults, title: "", description: "" });
      setMessage("Request submitted! Track status below.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">
        Hello Andy, {" "}
        <span className="text-slate-500 text-xl font-normal">(Student)</span>
      </h1>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Find your requests</h2>
        <p className="text-sm text-slate-500">
          Enter your UVA email to view pending and processed requests associated with it.
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={viewEmail}
            onChange={(e) => setViewEmail(e.target.value)}
            placeholder="you@virginia.edu"
          />
          <span className="text-xs text-slate-500">
            Must end with <code>@virginia.edu</code>
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Quick Submit</h2>
          <p className="text-sm text-slate-500">Fast way to log a request; switch to Submit tab for the detailed form.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Request title"
              value={quickForm.title}
              onChange={(e) => setQuickForm((prev) => ({ ...prev, title: e.target.value }))}
            />
            <select
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={quickForm.category}
              onChange={(e) => setQuickForm((prev) => ({ ...prev, category: e.target.value as NewFundingRequest["category"] }))}
            >
              <option value="Professional Development & Training">Professional Development & Training</option>
              <option value="Conference Travel & Presentations">Conference Travel & Presentations</option>
              <option value="Teaching Materials, Software, & Subscriptions">Teaching Materials, Software, & Subscriptions</option>
              <option value="Classroom & Instructional Technology">Classroom & Instructional Technology</option>
              <option value="TA / Grader / Student Worker Support">TA / Grader / Student Worker Support</option>
              <option value="Student Experience, Events, & Programming">Student Experience, Events, & Programming</option>
              <option value="Space, Furniture, & Facility Improvements">Space, Furniture, & Facility Improvements</option>
              <option value="Research & Lab Equipment (mixed with teaching)">Research & Lab Equipment (mixed with teaching)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <textarea
            className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="Brief description"
            rows={4}
            value={quickForm.description}
            onChange={(e) => setQuickForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <button
            type="button"
            disabled={submitting || quickForm.description.length < 10}
            onClick={handleQuickSubmit}
            className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Send Request"}
          </button>
          {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">AI Tips</h3>
          {recData ? (
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {recData.recommendations.map((rec) => (
                <li key={rec.priority} className="rounded-lg border border-slate-100 p-3">
                  <p className="font-medium text-slate-900">{rec.priority}</p>
                  <p className="text-xs text-slate-500">{rec.rationale}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Loading insights…</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Pending Requests</h3>
          <p className="text-xs text-slate-500">Status updates appear once staff review your submission.</p>
          <div className="mt-3 space-y-3">
            {pending.length === 0 ? (
              <p className="text-sm text-slate-500">No pending requests right now.</p>
            ) : (
              pending.map((req) => (
                <article key={req.id} className="rounded-xl border border-slate-100 p-4 text-sm text-slate-600">
                  <p className="text-sm font-semibold text-slate-900">{req.title}</p>
                  <p className="text-xs text-slate-500">{req.category} • submitted {new Date(req.createdAt).toLocaleDateString()}</p>
                  <p className="mt-1 text-xs text-slate-500">Urgency: {req.urgency}</p>
                  {hintsById[req.id] && (
                    <p className="mt-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      {hintsById[req.id]}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Processed Requests</h3>
          <p className="text-xs text-slate-500">See the latest decisions with policy notes.</p>
          <div className="mt-3 space-y-3">
            {processed.length === 0 ? (
              <p className="text-sm text-slate-500">No decisions yet.</p>
            ) : (
              processed.map((req) => (
                <article key={req.id} className="rounded-xl border border-slate-100 p-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{req.title}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        req.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{req.category}</p>
                  {hintsById[req.id] && (
                    <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      Policy Insight: {hintsById[req.id]}
                    </p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

