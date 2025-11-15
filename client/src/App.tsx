import { useState } from "react";
import { Header, type Tab } from "./components/Header";
import { DashboardPage } from "./pages/DashboardPage";
import { RequesteeDashboardPage } from "./pages/RequesteeDashboardPage";
import { SubmitRequestPage } from "./pages/SubmitRequestPage";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("admin");

  return (
    <div className="min-h-screen bg-slate-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {activeTab === "admin" && <DashboardPage />}
        {activeTab === "requestee" && <RequesteeDashboardPage />}
        {activeTab === "submit" && <SubmitRequestPage />}
      </main>
    </div>
  );
}

export default App;
