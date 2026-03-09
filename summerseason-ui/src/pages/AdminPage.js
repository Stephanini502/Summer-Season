import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("jwtToken");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [userForm, setUserForm] = useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    role: "4", 
  });

  const [leagueName, setLeagueName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const roleMap = {
    0: "Admin",
    1: "Referee",
    2: "League Admin",
    3: "Participant",
    4: "Guest",
  };

const normalizeUser = (u) => {
  let roles = u.roles ?? u.Roles ?? [];

  if (roles && roles.$values) roles = roles.$values;

  if (!Array.isArray(roles)) roles = [];

  return {
    id: u.id ?? u.Id,
    name: u.name ?? u.Name ?? "",
    surname: u.surname ?? u.Surname ?? "",
    userName: u.userName ?? u.UserName ?? "",
    roles, 
    totalPoints: u.totalPoints ?? u.TotalPoints ?? 0,
  };
};

  const normalizeLeague = (l) => ({
    id: l.id ?? l.Id,
    name: l.name ?? l.Name ?? "",
    creationDate: l.creationDate ?? l.CreationDate ?? new Date(),
  });

  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:5247/api/users", { headers });
      if (!res.ok) throw new Error(`Errore caricamento utenti (${res.status})`);
      let data = await res.json();
      if (data.$values) data = data.$values;
      setUsers(Array.isArray(data) ? data.map(normalizeUser) : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadLeagues = async () => {
    try {
      const res = await fetch("http://localhost:5247/api/leagues", { headers });
      if (!res.ok) throw new Error(`Errore caricamento leghe (${res.status})`);
      let data = await res.json();
      if (data.$values) data = data.$values;
      setLeagues(Array.isArray(data) ? data.map(normalizeLeague) : []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadUsers();
    loadLeagues();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");

    const roleName = roleMap[Number(userForm.role)];

    const newUser = {
      Name: userForm.name,
      Surname: userForm.surname,
      Username: userForm.username,
      Password: userForm.password,
      Roles: [roleName], 
      TotalPoints: 0,
    };

    try {
      const res = await fetch("http://localhost:5247/api/users", {
        method: "POST",
        headers,
        body: JSON.stringify(newUser),
      });
      if (!res.ok) throw new Error("Errore creazione utente");
      setUserForm({ name: "", surname: "", username: "", password: "", role: "3" });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (user) => {
    const confirm = window.confirm(`Sei sicuro di voler eliminare l'utente: ${user.surname}?`);
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5247/api/users/${user.id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Errore eliminazione utente (${res.status})`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateLeague = async (e) => {
    e.preventDefault();
    setError("");

    const newLeague = {
      name: leagueName,
      participantIds: selectedUsers,
      challengeIds: [],
    };

    try {
      const res = await fetch("http://localhost:5247/api/leagues", {
        method: "POST",
        headers,
        body: JSON.stringify(newLeague),
      });
      if (!res.ok) throw new Error("Errore creazione lega");
      setLeagueName("");
      setSelectedUsers([]);
      loadLeagues();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="container py-5" style={{ fontFamily: "'Segoe UI', sans-serif", backgroundColor: "#f2f3f7" }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="fw-bold text-primary">Admin Dashboard</h1>
        <button className="btn btn-primary"  onClick={() => navigate(`/admin/challenges`)}>
            Vai alle sfide
        </button>
      </div>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm rounded-lg border-0" style={{ backgroundColor: "#e9f0fb" }}>
            <div className="card-body text-center">
              <h5 className="text-secondary mb-2">Totale Utenti</h5>
              <h2 className="text-primary fw-bold">{users.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm rounded-lg border-0" style={{ backgroundColor: "#e9f0fb" }}>
            <div className="card-body text-center">
              <h5 className="text-secondary mb-2">Totale Leghe</h5>
              <h2 className="text-primary fw-bold">{leagues.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-5">
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-lg border-0">
            <div className="card-header bg-primary text-white fw-bold">Crea Nuovo Utente</div>
            <div className="card-body">
              <form onSubmit={handleCreateUser} className="row g-3">
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Nome"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Cognome"
                    value={userForm.surname}
                    onChange={(e) => setUserForm({ ...userForm, surname: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    className="form-control"
                    placeholder="Username"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <select
                    className="form-select"
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    {Object.keys(roleMap).map((r) => (
                      <option key={r} value={r}>{roleMap[r]}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6 d-grid">
                  <button className="btn btn-success">Crea Utente</button>
                </div>
              </form>
            </div>
          </div>

          <div className="card shadow-sm rounded-lg mt-4 border-0">
            <div className="card-header bg-secondary text-white fw-bold">Utenti Registrati</div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle" style={{ tableLayout: "fixed" }}>
                <thead className="table-light">
                  <tr>
                    <th>Nome</th>
                    <th>Cognome</th>
                    <th>Username</th>
                    <th>Ruolo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ cursor: "pointer" }}  onClick={() => navigate(`/user/${u.id}`)}>
                      <td>
                        <span
                          style={{ color: "red", fontWeight: "bold", marginRight: "10px", cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(u);
                          }}
                        >
                          X
                        </span>
                        {u.name}
                      </td>
                      <td>{u.surname}</td>
                      <td>{u.userName}</td>
                      <td>
                        {Array.isArray(u.roles)
                          ? u.roles.map((r) => roleMap[r] ?? r).join(", ")
                          : "Nessun ruolo"}
                      </td>                      
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm rounded-lg border-0">
            <div className="card-header bg-primary text-white fw-bold">Crea Nuova Lega</div>
            <div className="card-body">
              <form onSubmit={handleCreateLeague}>
                <input
                  className="form-control mb-3"
                  placeholder="Nome Lega"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  required
                />
                <label className="mb-2 fw-semibold">Seleziona partecipanti:</label>
                <div className="row g-2">
                  {users.map((u) => (
                    <div className="col-6 col-lg-4" key={u.id}>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedUsers.includes(u.id)}
                          onChange={() => handleSelectUser(u.id)}
                        />
                        <label className="form-check-label">{u.name} {u.surname}</label>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-success mt-3 w-100">Crea Lega</button>
              </form>
            </div>
          </div>

          <div className="card shadow-sm rounded-lg mt-4 border-0">
            <div className="card-header bg-secondary text-white fw-bold">Leghe</div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle" style={{ tableLayout: "fixed" }}>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Creazione</th>
                  </tr>
                </thead>
                <tbody>
                  {leagues.map((l) => (
                    <tr key={l.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/league/${l.id}`)}>
                      <td>{l.id}</td>
                      <td>{l.name}</td>
                      <td>{new Date(l.creationDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
