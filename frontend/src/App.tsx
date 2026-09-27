import React, { useEffect, useState } from "react";
import { RegisterPage } from "./pages/RegisterPage";

export const App: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>("Checking...");

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((res) => res.json())
      .then((data) => setApiStatus(data.status || "ok"))
      .catch(() => setApiStatus("Failed to fetch"));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "1px solid #eee", paddingBottom: "1rem", marginBottom: "1rem" }}>
        <h1>Exercise Progress Tracker</h1>
        <p style={{ margin: 0, color: "#666" }}>
          API Status: <strong style={{ color: apiStatus === "ok" ? "green" : "red" }}>{apiStatus}</strong>
        </p>
      </header>
      <main>
        <RegisterPage />
      </main>
    </div>
  );
};

export default App;
