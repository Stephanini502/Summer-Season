import { useState } from "react";
import { loginStyles } from "../style/SharedStyles";

function LoginPage({ onLoginSuccess }) {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5247/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Credenziali non valide");
      }

      const data = await res.json();
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("userId", data.user.id);

      const rolesRes = await fetch(`http://localhost:5247/api/users/${data.user.id}/roles`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      let rolesData = await rolesRes.json();
      if (rolesData && rolesData.$values) rolesData = rolesData.$values;
      const roles = Array.isArray(rolesData) ? rolesData : [];
      localStorage.setItem("userRoles", JSON.stringify(roles));

      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{loginStyles}</style>
      <div className="login-root">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">☀️</div>
            <div className="login-logo-text">Summer<span>Season</span></div>
          </div>

          <h2 className="login-title">Bentornato!</h2>
          <p className="login-subtitle">Accedi per continuare le tue sfide estive</p>

          {error && (
            <div className="login-alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label className="login-label">Username</label>
              <input
                type="text"
                className="login-input"
                placeholder="il_tuo_username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>
            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Accesso in corso..." : "🚀 Accedi"}
            </button>
          </form>

          <div className="login-divider">oppure</div>
          <div className="login-register-link">
            Non hai un account? <a href="/register">Registrati</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;