import React, { useState } from "react";
import { registerApi } from "../api/auth";

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setLoading(true);

    try {
      await registerApi({ email, password, display_name: displayName });
      setStatus("Käyttäjätili luotu onnistuneesti. Voit nyt siirtyä kirjautumiseen.");
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (err: any) {
      setError(err.message || "Tapahtui odottamaton virhe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto", padding: "1.5rem", border: "1px solid #ccc", borderRadius: 8, fontFamily: "sans-serif" }}>
      <h2 style={{ marginTop: 0 }}>Luo käyttäjätili</h2>
      
      {status && (
        <div style={{ padding: "0.75rem", backgroundColor: "#e6f4ea", color: "#137333", borderRadius: 4, marginBottom: "1rem" }}>
          {status}
        </div>
      )}

      {error && (
        <div style={{ padding: "0.75rem", backgroundColor: "#fce8e6", color: "#c5221f", borderRadius: 4, marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="reg-email" style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>Sähköposti</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="nimi@example.com"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="reg-display-name" style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>Näyttönimi</label>
          <input
            id="reg-display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder="Matti Meikäläinen"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="reg-password" style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>Salasana</label>
          <input
            id="reg-password"
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
          {loading ? "Tallennetaan..." : "Rekisteröidy"}
        </button>
      </form>
    </div>
  );
};
