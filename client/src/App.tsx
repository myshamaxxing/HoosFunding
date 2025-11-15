import { useState } from "react";
import { Header, type Tab } from "./components/Header";
import { DashboardPage } from "./pages/DashboardPage";
import { SubmitRequestPage } from "./pages/SubmitRequestPage";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-slate-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>{activeTab === "dashboard" ? <DashboardPage /> : <SubmitRequestPage />}</main>
    </div>
  );
}

export default App;
