import { useState } from "react";
import { useNavigate } from "react-router-dom";

const signupStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .signup-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: calc(100vh - 64px); /* 64px = altezza navbar */
    background: #0d1117;
    background-image:
      radial-gradient(ellipse at 80% 10%, rgba(96,165,250,0.07) 0%, transparent 50%),
      radial-gradient(ellipse at 10% 90%, rgba(251,191,36,0.06) 0%, transparent 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
  }

  .signup-card {
    background: #1a2236;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 44px 40px;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05);
    animation: signupFadeUp 0.45s ease both;
  }

  @keyframes signupFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .signup-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    justify-content: center;
  }

  .signup-logo-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 4px 16px rgba(251,191,36,0.3);
  }

  .signup-logo-text {
    font-family: 'Outfit', sans-serif;
    font-size: 1.4rem;
    font-weight: 800;
    color: #eef2ff;
    letter-spacing: -0.02em;
  }
  .signup-logo-text span { color: #fbbf24; }

  .signup-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: #eef2ff;
    letter-spacing: -0.02em;
    text-align: center;
    margin-bottom: 6px;
  }

  .signup-subtitle {
    font-size: 0.82rem;
    color: #8b97b8;
    text-align: center;
    margin-bottom: 28px;
  }

  .signup-alert {
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

  .signup-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 0;
  }

  .signup-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 16px;
  }

  .signup-label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #8b97b8;
  }

  .signup-input {
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
  .signup-input::placeholder { color: #4b5675; }
  .signup-input:focus {
    border-color: #3b82f6;
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(96,165,250,0.12);
  }

  .signup-btn {
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
    margin-top: 4px;
    box-shadow: 0 4px 16px rgba(251,191,36,0.25);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .signup-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(251,191,36,0.35);
  }
  .signup-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .signup-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 20px;
    color: #4b5675;
    font-size: 0.75rem;
  }
  .signup-divider::before,
  .signup-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }

  .signup-login-link {
    text-align: center;
    font-size: 0.82rem;
    color: #8b97b8;
  }
  .signup-login-link a {
    color: #60a5fa;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.15s;
  }
  .signup-login-link a:hover { color: #93c5fd; }

  .signup-perks {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .signup-perk {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.74rem;
    color: #8b97b8;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    padding: 5px 12px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    .signup-card { padding: 32px 24px; }
    .signup-form-row { grid-template-columns: 1fr; }
  }
`;

function SignUpPage({ onLoginSuccess }) {
  const [registerForm, setRegisterForm] = useState({ name: "", surname: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5247/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registrazione fallita");
      }

      alert("Registrazione avvenuta con successo! Ora puoi fare il login.");
      setRegisterForm({ name: "", surname: "", username: "", password: "" });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{signupStyles}</style>
      <div className="signup-root">
        <div className="signup-card">
          <div className="signup-logo">
            <div className="signup-logo-icon">☀️</div>
            <div className="signup-logo-text">Summer<span>Season</span></div>
          </div>

          <h2 className="signup-title">Unisciti alla gara!</h2>
          <p className="signup-subtitle">Crea il tuo account e inizia a sfidare tutti</p>

          <div className="signup-perks">
            <div className="signup-perk">🏆 Leghe</div>
            <div className="signup-perk">⭐ Punti</div>
            <div className="signup-perk">🏁 Sfide</div>
          </div>

          {error && (
            <div className="signup-alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="signup-form-row">
              <div className="signup-field">
                <label className="signup-label">Nome</label>
                <input
                  type="text"
                  className="signup-input"
                  placeholder="Mario"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="signup-field">
                <label className="signup-label">Cognome</label>
                <input
                  type="text"
                  className="signup-input"
                  placeholder="Rossi"
                  value={registerForm.surname}
                  onChange={(e) => setRegisterForm({ ...registerForm, surname: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="signup-field">
              <label className="signup-label">Username</label>
              <input
                type="text"
                className="signup-input"
                placeholder="mario.rossi"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                required
              />
            </div>
            <div className="signup-field">
              <label className="signup-label">Password</label>
              <input
                type="password"
                className="signup-input"
                placeholder="••••••••"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Registrazione in corso..." : "🚀 Registrati"}
            </button>
          </form>

          <div className="signup-divider">hai già un account?</div>
          <div className="signup-login-link">
            <a href="/">Accedi qui</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;