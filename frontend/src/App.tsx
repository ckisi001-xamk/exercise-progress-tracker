import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";

const MainContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [view, setView] = useState<"login" | "register">("login");

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem", fontFamily: "sans-serif" }}>
      <header style={{ 
        borderBottom: "1px solid #e0e0e0", 
        paddingBottom: "1rem", 
        marginBottom: "2rem", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>Exercise Progress Tracker</h1>
        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>Kirjautuneena: <strong>{user?.display_name}</strong></span>
            <button 
              onClick={logout} 
              style={{ padding: "6px 14px", cursor: "pointer", borderRadius: 4, border: "1px solid #ccc", background: "#f8f9fa" }}
            >
              Kirjaudu ulos
            </button>
          </div>
        ) : (
          <div>
            <button 
              onClick={() => setView(view === "login" ? "register" : "login")}
              style={{ padding: "6px 14px", cursor: "pointer", borderRadius: 4, border: "1px solid #1a73e8", background: "#fff", color: "#1a73e8", fontWeight: 500 }}
            >
              {view === "login" ? "Siirry rekisteröitymiseen" : "Siirry kirjautumiseen"}
            </button>
          </div>
        )}
      </header>
      <main>
        {isAuthenticated ? (
          <div style={{ padding: "2rem", backgroundColor: "#f8f9fa", borderRadius: 8, textAlign: "center", border: "1px solid #e0e0e0" }}>
            <h2>Tervetuloa järjestelmään, {user?.display_name}!</h2>
            <p>Käyttäjätunnus (email): {user?.email}</p>
            <p>Järjestelmä-ID: <code>{user?.id}</code></p>
          </div>
        ) : (
          view === "login" ? <LoginPage /> : <RegisterPage />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
