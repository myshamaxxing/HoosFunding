import { useState } from "react";
import type { FormEvent } from "react";
import { createRequest, precheckRequest } from "../api";
import type { FundingRequest, NewFundingRequest, RequestCategory, UserRole } from "../types";

const roleOptions: UserRole[] = ["Student", "Professor", "Staff", "Other"];
const categoryOptions: RequestCategory[] = [
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
const urgencyOptions: Array<NewFundingRequest["urgency"]> = ["Low", "Medium", "High"];

const defaultForm: NewFundingRequest = {
  name: "",
  email: "",
  role: "Student",
  category: "Tech",
  title: "",
  description: "",
  urgency: "Medium",
};

export function SubmitRequestPage() {
  const [form, setForm] = useState<NewFundingRequest>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [recent, setRecent] = useState<FundingRequest[]>([]);
  const [precheck, setPrecheck] = useState<string | null>(null);
  const [isPrechecking, setIsPrechecking] = useState(false);

  const handleChange = (field: keyof NewFundingRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!form.email.toLowerCase().endsWith("@virginia.edu")) {
      setMessage("Please use a valid UVA email ending in @virginia.edu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createRequest(form);
      setRecent((prev) => [created, ...prev].slice(0, 3));
      setForm(defaultForm);
      setPrecheck(null);
      setMessage("Request submitted successfully! The admin team will review it soon.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

  const shouldRunPrecheck = form.description.trim().length >= 20 && form.category;

  async function handlePrecheck() {
    if (!shouldRunPrecheck) {
      setPrecheck(null);
      return;
    }
    setIsPrechecking(true);
    try {
      const result = await precheckRequest({
        category: form.category,
        description: form.description,
      });
      setPrecheck(result.preCheckMessage);
    } catch (error) {
      console.error(error);
      setPrecheck(null);
    } finally {
      setIsPrechecking(false);
    }
  }

  useEffect(() => {
    void handlePrecheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.category, form.description]);

  return (
    <section className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Submit a Funding Request</h2>
        <p className="mt-2 text-sm text-slate-600">
          Provide as much detail as possible so department operations can prioritize your request.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Name
            <input
              className={`${inputClass} mt-1`}
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              required
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            UVA Email
            <input
              className={`${inputClass} mt-1`}
              type="email"
              placeholder="you@virginia.edu"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              required
              pattern=".+@virginia\\.edu"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Role
            <select
              className={`${inputClass} mt-1`}
              value={form.role}
              onChange={(event) => handleChange("role", event.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Category
            <select
              className={`${inputClass} mt-1`}
              value={form.category}
              onChange={(event) => handleChange("category", event.target.value)}
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Urgency
            <select
              className={`${inputClass} mt-1`}
              value={form.urgency}
              onChange={(event) => handleChange("urgency", event.target.value)}
            >
              {urgencyOptions.map((urgency) => (
                <option key={urgency} value={urgency}>
                  {urgency}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="text-sm font-medium text-slate-700">
          Title
          <input
            className={`${inputClass} mt-1`}
            value={form.title}
            onChange={(event) => handleChange("title", event.target.value)}
            required
          />
        </label>

        <label className="text-sm font-medium text-slate-700">
          Description / Reason
          <textarea
            className={`${inputClass} mt-1`}
            rows={5}
            value={form.description}
            onChange={(event) => handleChange("description", event.target.value)}
            required
          />
          {shouldRunPrecheck && (
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {isPrechecking
                ? "Analyzing similar requests..."
                : precheck ?? "Gathering policy insight..."}
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>

        {message && (
          <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p>
        )}
      </form>

      {recent.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-slate-900">Recently submitted (this session)</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {recent.map((req) => (
              <li key={req.id} className="rounded-lg border border-slate-100 p-3">
                <p className="font-medium text-slate-800">
                  {req.title} • <span className="text-primary">{req.category}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {req.role} | Submitted {new Date(req.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

