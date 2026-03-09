import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUpPage({ onLoginSuccess }) {
  const [registerForm, setRegisterForm] = useState({ name: "", surname: "", username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5247/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Registration failed");
      }

      alert("Registrazione avvenuta con successo! Ora puoi fare il login.");
      setRegisterForm({ name: "", surname: "", username: "", password: "" });
      navigate("/"); // torna alla pagina principale/login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: "#eef2f7" }}>
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4 text-primary">Registrazione</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nome"
            value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="Cognome"
            value={registerForm.surname}
            onChange={(e) => setRegisterForm({ ...registerForm, surname: e.target.value })}
            required
          />
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">Registrati</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
