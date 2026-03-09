import { useState } from "react";

function LoginPage({ onLoginSuccess }) {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5247/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
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
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{backgroundColor: "#eef2f7" }}>
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4 text-primary">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
