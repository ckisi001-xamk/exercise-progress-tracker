import React, { useState } from "react";
import { loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginApi({ email, password });
      await login(data.access_token);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "Tunnus tai salasana virheellinen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto", padding: "1.5rem", border: "1px solid #ccc", borderRadius: 8, fontFamily: "sans-serif" }}>
      <h2 style={{ marginTop: 0 }}>Kirjaudu sisään</h2>

      {error && (
        <div style={{ padding: "0.75rem", backgroundColor: "#fce8e6", color: "#c5221f", borderRadius: 4, marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="login-email" style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>Sähköposti</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="nimi@example.com"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="login-password" style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>Salasana</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px", backgroundColor: "#1a73e8", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "Tarkistetaan..." : "Kirjaudu"}
        </button>
      </form>
    </div>
  );
};
