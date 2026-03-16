import { useState } from "react";

const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .login-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: #0d1117;
    background-image:
      radial-gradient(ellipse at 20% 20%, rgba(96,165,250,0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(251,191,36,0.06) 0%, transparent 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .login-card {
    background: #1a2236;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 44px 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05);
    animation: loginFadeUp 0.45s ease both;
  }

  @keyframes loginFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 32px;
    justify-content: center;
  }

  .login-logo-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 4px 16px rgba(251,191,36,0.3);
  }

  .login-logo-text {
    font-family: 'Outfit', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    color: #eef2ff;
    letter-spacing: -0.02em;
  }

  .login-logo-text span { color: #fbbf24; }

  .login-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: #eef2ff;
    letter-spacing: -0.02em;
    text-align: center;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 0.82rem;
    color: #8b97b8;
    text-align: center;
    margin-bottom: 32px;
  }

  .login-alert {
    background: rgba(248,113,113,0.1);
    border: 1px solid rgba(248,113,113,0.25);
    color: #f87171;
    border-radius: 10px;
    padding: 11px 16px;
    font-size: 0.82rem;
    font-weight: 500;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }

  .login-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8b97b8;
  }

  .login-input {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.88rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #eef2ff;
    padding: 12px 16px;
    border-radius: 10px;
    width: 100%;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }
  .login-input::placeholder { color: #4b5675; }
  .login-input:focus {
    border-color: #3b82f6;
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(96,165,250,0.12);
  }

  .login-btn {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 700;
    background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
    color: #0d1117;
    border: none;
    padding: 13px 20px;
    border-radius: 10px;
    width: 100%;
    cursor: pointer;
    margin-top: 8px;
    box-shadow: 0 4px 16px rgba(251,191,36,0.25);
    transition: transform 0.15s, box-shadow 0.15s;
    letter-spacing: 0.01em;
  }
  .login-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(251,191,36,0.35);
  }
  .login-btn:active { transform: translateY(0); }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 20px;
    color: #4b5675;
    font-size: 0.75rem;
  }
  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .login-register-link {
    text-align: center;
    font-size: 0.82rem;
    color: #8b97b8;
  }
  .login-register-link a {
    color: #60a5fa;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.15s;
  }
  .login-register-link a:hover { color: #93c5fd; }
`;

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