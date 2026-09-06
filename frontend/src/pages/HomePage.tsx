import React, { useEffect, useState } from "react";
import { API_BASE_URL, getHealth } from "../api/client";

export const HomePage: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<string>("Checking...");
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    getHealth()
      .then((data) => {
        setHealthStatus(data.status);
        setIsOnline(true);
      })
      .catch((err) => {
        setHealthStatus(err.message);
        setIsOnline(false);
      });
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif" }}>
      <h1>Exercise Progress Tracker</h1>
      <p>Sprint 1: Perusta ja runko pystyssä.</p>
      <div style={{ marginTop: "1.5rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "4px", maxWidth: "400px" }}>
        <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
        <p>
          <strong>API Status: </strong>
          <span style={{ color: isOnline ? "green" : "red", fontWeight: "bold" }}>
            {healthStatus}
          </span>
        </p>
      </div>
    </main>
  );
};
