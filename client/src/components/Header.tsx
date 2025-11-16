import type { FC } from "react";
import brandImage from "../assets/Screenshot 2025-11-15 at 6.55.39 PM.png";

type Tab = "admin" | "requestee" | "stats" | "submit";

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const adminTabs: { label: string; value: Tab }[] = [
  { label: "Admin Dashboard", value: "admin" },
  { label: "Request Statistics", value: "stats" },
];

const requestTabs: { label: string; value: Tab }[] = [
  { label: "Requestee Dashboard", value: "requestee" },
  { label: "Submit Request", value: "submit" },
];

export const Header: FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <img
            src={brandImage}
            alt="Hoos Funding logo"
            className="h-16 w-auto object-contain"
          />
          <span className="sr-only">HoosFunding Department Resource Portal</span>
        </div>
        <nav className="flex gap-4 rounded-full bg-slate-100 p-2">
          <div className="flex gap-2 rounded-full border border-slate-200 bg-white/90 px-2 py-1 shadow-sm">
            {adminTabs.map((tab) => {
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
          </div>
          <div className="h-6 w-px self-center bg-slate-200" aria-hidden />
          <div className="flex gap-2 rounded-full border border-slate-200 bg-white/90 px-2 py-1 shadow-sm">
            {requestTabs.map((tab) => {
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
          </div>
        </nav>
      </div>
    </header>
  );
};

export type { Tab };

