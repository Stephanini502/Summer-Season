import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupStyles } from "../style/SharedStyles";

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