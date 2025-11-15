import type { FC } from "react";

type Tab = "admin" | "requestee" | "stats" | "submit";

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { label: string; value: Tab }[] = [
  { label: "Admin Dashboard", value: "admin" },
  { label: "Requestee Dashboard", value: "requestee" },
  { label: "Request Statistics", value: "stats" },
  { label: "Submit Request", value: "submit" },
];

export const Header: FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-primary-light">HoosFunding</p>
          <h1 className="text-2xl font-semibold text-slate-900">Department Resource Portal</h1>
        </div>
        <nav className="flex gap-2 rounded-full bg-slate-100 p-1">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange(tab.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? "bg-white text-primary shadow" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export type { Tab };

