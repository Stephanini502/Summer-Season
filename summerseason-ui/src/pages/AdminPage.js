import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminStyles } from "../style/SharedStyles";
import { pointRequestAdminStyles } from "../style/SharedStyles";

const roleMap = {
  0: "Admin", 1: "Referee", 2: "League Admin", 3: "Participant", 4: "Guest"
};

function PendingBadge({ token }) {
  const [count, setCount] = useState(0);
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch("http://localhost:5247/api/pointrequests/pending", { headers });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.$values ?? [];
        setCount(list.length);
      } catch { }
    };
    fetch_();
    const interval = setInterval(fetch_, 30000);
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;
  return (
    <span style={{
      background: "#ef4444", color: "#fff",
      fontSize: "0.68rem", fontWeight: 800,
      padding: "3px 10px", borderRadius: 20,
    }}>
      {count} in attesa
    </span>
  );
}

const parseProposal = (message) => {
  try {
    const refMatch = message.match(/L'arbitro (.+?) propone/);
    const challengeMatch = message.match(/sfida '(.+?)':/);
    const nameMatch = message.match(/Nome: (.+?),/);
    const descMatch = message.match(/Descrizione: (.+?),/);
    const ptsMatch = message.match(/Punti: (\d+)/);
    return {
      referee: refMatch?.[1] ?? "—",
      challenge: challengeMatch?.[1] ?? "—",
      name: nameMatch?.[1] ?? "—",
      description: descMatch?.[1] ?? "—",
      points: ptsMatch?.[1] ?? "—"
    };
  } catch { return null; }
};

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !(n.isRead ?? n.IsRead)).length;


  const token = localStorage.getItem("jwtToken");
  const adminId = parseInt(localStorage.getItem("userId"));
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [userForm, setUserForm] = useState({ name: "", surname: "", username: "", password: "", role: "4" });
  const [leagueName, setLeagueName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const normalizeUser = (u) => {
    let roles = u.roles ?? u.Roles ?? [];
    if (roles && roles.$values) roles = roles.$values;
    if (!Array.isArray(roles)) roles = [];
    return { id: u.id ?? u.Id, name: u.name ?? u.Name ?? "", surname: u.surname ?? u.Surname ?? "", userName: u.userName ?? u.UserName ?? "", roles, totalPoints: u.totalPoints ?? u.TotalPoints ?? 0 };
  };

  const normalizeLeague = (l) => ({
    id: l.id ?? l.Id, name: l.name ?? l.Name ?? "", creationDate: l.creationDate ?? l.CreationDate ?? new Date()
  });

  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:5247/api/users", { headers });
      if (!res.ok) throw new Error(`Errore caricamento utenti (${res.status})`);
      let data = await res.json();
      if (data.$values) data = data.$values;
      const all = Array.isArray(data) ? data.map(normalizeUser) : [];
      setUsers(all);
      setParticipants(all.filter(u => !u.roles.includes(0) && !u.roles.includes(1)));
    } catch (err) { setError(err.message); }
  };

  const loadLeagues = async () => {
    try {
      const res = await fetch("http://localhost:5247/api/leagues", { headers });
      if (!res.ok) throw new Error(`Errore caricamento leghe (${res.status})`);
      let data = await res.json();
      if (data.$values) data = data.$values;
      setLeagues(Array.isArray(data) ? data.map(normalizeLeague) : []);
    } catch (err) { setError(err.message); }
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5247/api/notifications/user/${adminId}`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.$values ?? [];
      setNotifications(list.filter(n => (n.type ?? n.Type) === "ChallengeProposal" && !(n.isRead ?? n.IsRead)));
    } catch { }
  };

  useEffect(() => {
    loadUsers();
    loadLeagues();
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
    try {
      await fetch(`http://localhost:5247/api/notifications/${id}/read`, { method: "PUT", headers });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch { }
  };

  const markAllRead = async () => {
    try {
      await fetch(`http://localhost:5247/api/notifications/user/${adminId}/read-all`, { method: "PUT", headers });
      setNotifications([]);
    } catch { }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault(); setError("");
    const roleName = roleMap[Number(userForm.role)];
    try {
      const res = await fetch("http://localhost:5247/api/users", {
        method: "POST", headers,
        body: JSON.stringify({ Name: userForm.name, Surname: userForm.surname, Username: userForm.username, Password: userForm.password, Roles: [roleName], TotalPoints: 0 })
      });
      if (!res.ok) throw new Error("Errore creazione utente");
      setUserForm({ name: "", surname: "", username: "", password: "", role: "4" });
      loadUsers();
    } catch (err) { setError(err.message); }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Eliminare l'utente ${user.name} ${user.surname}?`)) return;
    try {
      const res = await fetch(`http://localhost:5247/api/users/${user.id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error(`Errore eliminazione (${res.status})`);
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err) { setError(err.message); }
  };

  const handleDeleteLeague = async (league) => {
    if (!window.confirm(`Eliminare la lega "${league.name}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5247/api/leagues/${league.id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Errore eliminazione lega");
      setLeagues(prev => prev.filter(l => l.id !== league.id));
    } catch (err) { setError(err.message); }
  };

  const handleCreateLeague = async (e) => {
    e.preventDefault(); setError("");
    try {
      const res = await fetch("http://localhost:5247/api/leagues", {
        method: "POST", headers,
        body: JSON.stringify({ name: leagueName, participantIds: selectedUsers, challengeIds: [] })
      });
      if (!res.ok) throw new Error("Errore creazione lega");
      setLeagueName(""); setSelectedUsers([]);
      loadLeagues();
    } catch (err) { setError(err.message); }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  return (
    <>
      <style>{adminStyles}{pointRequestAdminStyles}{`
        .notif-item {
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 16px;
          transition: background 0.14s;
        }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: rgba(255,255,255,0.02); }
        .notif-icon {
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 1rem;
        }
        .notif-read-btn {
          flex-shrink: 0; padding: 5px 12px;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          background: transparent; color: var(--text-muted);
          font-size: 0.72rem; font-weight: 600; cursor: pointer;
          transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .notif-read-btn:hover {
          background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3);
          color: var(--success);
        }
      `}</style>

      <div className="adm-root">
        <div className="adm-content">

          <header className="adm-header">
            <div>
              <p className="adm-eyebrow">SummerSeason Platform</p>
              <h1 className="adm-title">Admin Dashboard</h1>
            </div>
            <button className="adm-btn-primary" onClick={() => navigate("/challenges")}>
              <span>🏁</span> Vai alle sfide
            </button>
          </header>

          {error && <div className="adm-alert"><span>⚠️</span> {error}</div>}

          <div
            className="adm-card"
            style={{ marginBottom: 24, cursor: "pointer", borderColor: unreadCount > 0 ? "rgba(245,158,11,0.25)" : undefined }}
            onClick={() => navigate("/admin/proposals")}
          >
            <div className="adm-card-header" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="adm-card-icon" style={unreadCount > 0 ? { background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.3)" } : {}}>🔔</div>
                <div>
                  <h2 className="adm-card-title">Proposte modifiche da arbitri</h2>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                    Clicca per vedere tutte le proposte
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {unreadCount > 0 && (
                  <span style={{
                    background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                    color: "var(--warning)", fontSize: "0.68rem", fontWeight: 800,
                    padding: "3px 10px", borderRadius: 20
                  }}>
                    {unreadCount} nuove
                  </span>
                )}
                <span style={{ color: "var(--text-muted)", fontSize: "1rem" }}>→</span>
              </div>
            </div>
          </div>

          <div
            className="adm-card"
            style={{ marginBottom: 24, cursor: "pointer" }}
            onClick={() => navigate("/admin/requests")}
          >
            <div className="adm-card-header" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="adm-card-icon">⏳</div>
                <div>
                  <h2 className="adm-card-title">Richieste punti in attesa</h2>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                    Clicca per vedere e gestire tutte le richieste
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <PendingBadge token={token} />
                <span style={{ color: "var(--text-muted)", fontSize: "1rem" }}>→</span>
              </div>
            </div>
          </div>

          <div className="adm-stats">
            <div className="adm-stat-card">
              <div><p className="adm-stat-label">Utenti registrati</p><p className="adm-stat-value">{users.length}</p></div>
              <div className="adm-stat-icon-wrap">👤</div>
            </div>
            <div className="adm-stat-card">
              <div><p className="adm-stat-label">Leghe attive</p><p className="adm-stat-value">{leagues.length}</p></div>
              <div className="adm-stat-icon-wrap">🏆</div>
            </div>
          </div>

          <div className="adm-grid">
            <div className="adm-col">

              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-icon">✏️</div>
                  <h2 className="adm-card-title">Crea nuovo utente</h2>
                </div>
                <div className="adm-card-body">
                  <form onSubmit={handleCreateUser}>
                    <div className="adm-form-grid">
                      <div className="adm-field">
                        <label className="adm-field-label">Nome</label>
                        <input className="adm-input" placeholder="Mario" value={userForm.name}
                          onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
                      </div>
                      <div className="adm-field">
                        <label className="adm-field-label">Cognome</label>
                        <input className="adm-input" placeholder="Rossi" value={userForm.surname}
                          onChange={e => setUserForm({ ...userForm, surname: e.target.value })} required />
                      </div>
                      <div className="adm-field">
                        <label className="adm-field-label">Username</label>
                        <input className="adm-input" placeholder="mario.rossi" value={userForm.username}
                          onChange={e => setUserForm({ ...userForm, username: e.target.value })} required />
                      </div>
                      <div className="adm-field">
                        <label className="adm-field-label">Password</label>
                        <input type="password" className="adm-input" placeholder="••••••••" value={userForm.password}
                          onChange={e => setUserForm({ ...userForm, password: e.target.value })} required />
                      </div>
                    </div>
                    <div className="adm-field" style={{ marginTop: "4px" }}>
                      <label className="adm-field-label">Ruolo</label>
                      <select
                        className="dark-select"
                        style={{ marginTop: "5px" }}
                        value={userForm.role}
                        onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                      >
                        {Object.keys(roleMap)
                          .filter(r => r !== "3")
                          .map(r => <option key={r} value={r}>{roleMap[r]}</option>)}
                      </select>
                    </div>
                    <button type="submit" className="adm-btn-submit">Crea utente</button>
                  </form>
                </div>
              </div>

              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-icon">👥</div>
                  <h2 className="adm-card-title">Utenti registrati</h2>
                </div>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Nome</th><th>Username</th><th>Ruolo</th></tr>
                    </thead>
                    <tbody>
                      {users.length === 0 && <tr><td colSpan="3"><div className="adm-empty">Nessun utente registrato</div></td></tr>}
                      {users.map(u => (
                        <tr key={u.id} onClick={() => navigate(`/user/${u.id}`)}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <span className="adm-delete-btn" onClick={e => { e.stopPropagation(); handleDeleteUser(u); }}>✕</span>
                              <span style={{ fontWeight: 600 }}>{u.name} {u.surname}</span>
                            </div>
                          </td>
                          <td className="muted">{u.userName}</td>
                          <td>
                            {Array.isArray(u.roles) && u.roles.length > 0
                              ? u.roles.map((r, i) => <span key={i} className="adm-role-badge">{roleMap[r] ?? r}</span>)
                              : <span style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="adm-col">

              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-icon">🏅</div>
                  <h2 className="adm-card-title">Crea nuova lega</h2>
                </div>
                <div className="adm-card-body">
                  <form onSubmit={handleCreateLeague}>
                    <div className="adm-field" style={{ marginBottom: "16px" }}>
                      <label className="adm-field-label">Nome lega</label>
                      <input className="adm-input" style={{ marginTop: "5px" }} placeholder="es. Serie A 2025" value={leagueName}
                        onChange={e => setLeagueName(e.target.value)} required />
                    </div>
                    <p className="adm-section-label">Partecipanti</p>
                    <div className="adm-participants">
                      {participants.map(u => (
                        <label key={u.id} className={`adm-participant-item ${selectedUsers.includes(u.id) ? "selected" : ""}`}
                          onClick={() => handleSelectUser(u.id)}>
                          <input type="checkbox" readOnly checked={selectedUsers.includes(u.id)} />
                          <span className="adm-participant-label">{u.name} {u.surname}</span>
                        </label>
                      ))}
                    </div>
                    <button type="submit" className="adm-btn-submit">Crea lega</button>
                  </form>
                </div>
              </div>

              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-icon">🗂️</div>
                  <h2 className="adm-card-title">Leghe</h2>
                </div>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Nome</th><th>Data creazione</th><th></th></tr>
                    </thead>
                    <tbody>
                      {leagues.length === 0 && <tr><td colSpan="3"><div className="adm-empty">Nessuna lega creata</div></td></tr>}
                      {leagues.map(l => (
                        <tr key={l.id} onClick={() => navigate(`/league/${l.id}`)}>
                          <td>
                            <div className="adm-league-name">
                              <span className="adm-league-pip" />
                              {l.name}
                            </div>
                          </td>
                          <td className="muted">{new Date(l.creationDate).toLocaleDateString("it-IT")}</td>
                          <td>
                            <span className="adm-delete-btn" onClick={e => { e.stopPropagation(); handleDeleteLeague(l); }}>✕</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;