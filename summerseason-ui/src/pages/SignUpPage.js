import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupStyles } from "../style/SharedStyles";

function SignUpPage({ onLoginSuccess }) {
  const [registerForm, setRegisterForm] = useState({ name: "", surname: "", username: "", password: "" });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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

      setSuccess("Registrazione avvenuta con successo! Verrai reindirizzato al login...");
      setRegisterForm({ name: "", surname: "", username: "", password: "" });

      // Aspetta 2 secondi poi naviga, così l'utente legge il messaggio
      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{signupStyles}{extraStyles}</style>
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

          {success && (
            <div className="signup-success">
              <span>✓</span> {success}
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

            <button type="submit" className="signup-btn" disabled={loading || !!success}>
              {loading ? "Registrazione in corso..." : success ? "✓ Fatto!" : "🚀 Registrati"}
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

const extraStyles = `
  .signup-success {
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.3);
    color: #34d399;
    border-radius: 10px;
    padding: 11px 16px;
    font-size: 0.82rem;
    font-weight: 500;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: signupFadeUp 0.3s ease both;
  }
`;

export default SignUpPage;