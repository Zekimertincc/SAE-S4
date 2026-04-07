import { useState } from "react";
import LoginForm from "./features/auth/components/LoginForm";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Montserrat', sans-serif",
      background: "#f0f4f8"
    }}>
      <h1 style={{ fontSize: "24px", color: "#111827", marginBottom: "8px" }}>
        Bienvenue
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        {localStorage.getItem("email")}
      </p>
      <button
        onClick={handleLogout}
        style={{
          padding: "12px 24px",
          background: "#1e3a5f",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "600",
          fontFamily: "'Montserrat', sans-serif",
          cursor: "pointer",
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}