import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { adminStyles } from "../style/SharedStyles";
import { pointRequestAdminStyles } from "../style/SharedStyles";

/* ─── Role helpers ──────────────────────────────────────────────────────── */
const roleMap = { 0: "Admin", 1: "Referee", 2: "League Admin", 3: "Participant", 4: "Guest" };
const roleNameToNum = Object.fromEntries(Object.entries(roleMap).map(([k, v]) => [v, Number(k)]));

const normalizeRoles = (raw) => {
  let roles = raw ?? [];
  if (roles && roles.$values) roles = roles.$values;
  if (!Array.isArray(roles)) roles = [];
  return roles.map((r) => (typeof r === "string" ? (roleNameToNum[r] ?? r) : r));
};

/* ─── Pending badge ─────────────────────────────────────────────────────── */
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

/* ─── Create League Modal ───────────────────────────────────────────────── */
function CreateLeagueModal({ participants, onClose, onCreated, headers }) {
  const [leagueName, setLeagueName] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchRef = useRef();

  useEffect(() => { setTimeout(() => searchRef.current?.focus(), 80); }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = participants.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.userName || "").toLowerCase().includes(q) ||
      `${u.name} ${u.surname}`.toLowerCase().includes(q)
    );
  });

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelected(filtered.map((u) => u.id));
  const clearAll  = () => setSelected([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("http://localhost:5247/api/leagues", {
        method: "POST", headers,
        body: JSON.stringify({ name: leagueName, participantIds: selected, challengeIds: [] }),
      });
      if (!res.ok) throw new Error("Errore creazione lega");
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedUsers = selected.map((id) => participants.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" style={{ maxWidth: "650px" }}> {/* Allargato leggermente per la griglia */}

        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="adm-card-icon">🏅</div>
            <h2 className="adm-card-title" style={{ fontSize: "1rem" }}>Crea nuova lega</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            <div className="adm-field" style={{ marginBottom: 20 }}>
              <label className="adm-field-label">Nome lega</label>
              <input
                className="adm-input"
                style={{ marginTop: 5 }}
                placeholder="es. Serie A 2025"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                required
              />
            </div>

            <div className="adm-field">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="adm-field-label">
                  Partecipanti
                  {selected.length > 0 && (
                    <span style={{
                      marginLeft: 8, fontSize: "0.68rem", fontWeight: 700,
                      padding: "2px 8px", borderRadius: 20,
                      background: "rgba(96,165,250,0.12)",
                      border: "1px solid rgba(96,165,250,0.2)",
                      color: "var(--ocean)",
                    }}>
                      {selected.length} selezionati
                    </span>
                  )}
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {filtered.length > 0 && (
                    <button type="button" className="modal-text-btn" onClick={selectAll}>
                      Tutti
                    </button>
                  )}
                  {selected.length > 0 && (
                    <button type="button" className="modal-text-btn modal-text-btn--danger" onClick={clearAll}>
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="modal-search-wrap">
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)" }}>🔍</span>
                <input
                  ref={searchRef}
                  className="modal-search-input"
                  placeholder="Cerca per nome o username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoComplete="off"
                />
                {search && (
                  <button type="button" className="modal-search-clear" onClick={() => setSearch("")}>✕</button>
                )}
              </div>

              {/* LISTA MIGLIORATA: Layout a Griglia */}
              <div className="modal-participant-list" style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", 
                gap: "8px",
                padding: "8px",
                background: "rgba(0,0,0,0.2)"
              }}>
                {filtered.length === 0 ? (
                  <div className="modal-empty" style={{ gridColumn: "1/-1" }}>
                    {search ? `Nessun risultato per "${search}"` : "Nessun partecipante disponibile"}
                  </div>
                ) : (
                  filtered.map((u) => {
                    const isSelected = selected.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        className={`modal-participant-item${isSelected ? " modal-participant-item--selected" : ""}`}
                        onClick={() => toggle(u.id)}
                        style={{ 
                          borderRadius: "10px", 
                          border: "1px solid rgba(255,255,255,0.05)",
                          padding: "8px 12px" 
                        }}
                      >
                        <div className="modal-participant-check">
                          {isSelected ? "✓" : ""}
                        </div>
                        <div className="user-search-avatar" style={{ width: 26, height: 26, fontSize: '0.65rem' }}>
                          {(u.name?.[0] ?? "?").toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.78rem", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {u.name} {u.surname}
                          </div>
                          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.45)" }}>
                            @{u.userName}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {selectedUsers.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>
                  Selezionati ({selectedUsers.length})
                </p>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: 6, 
                  maxHeight: "80px", 
                  overflowY: "auto",
                  padding: "4px" 
                }}>
                  {selectedUsers.map((u) => (
                    <span key={u.id} className="selected-user-chip">
                      {u.name} {u.surname}
                      <button type="button" onClick={() => toggle(u.id)}>✕</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="adm-alert" style={{ marginTop: 14 }}>
                <span>⚠️</span> {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>Annulla</button>
            <button type="submit" className="adm-btn-submit" style={{ margin: 0, width: "auto", padding: "10px 28px" }} disabled={loading}>
              {loading ? "Creazione…" : "Crea lega"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
function AdminPage() {
  const [users, setUsers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [showCreateLeague, setShowCreateLeague] = useState(false);
  const navigate = useNavigate();
  const [showAllUsers, setShowAllUsers] = useState(false);
  
  const PREVIEW_COUNT = 5;
  const displayedUsers = showAllUsers ? users : users.slice(0, PREVIEW_COUNT);
  const token = localStorage.getItem("jwtToken");
  const adminId = parseInt(localStorage.getItem("userId"));
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [userForm, setUserForm] = useState({ name: "", surname: "", username: "", password: "", role: "4" });

  const unreadCount = notifications.filter((n) => !(n.isRead ?? n.IsRead)).length;

  const normalizeUser = (u) => {
    const roles = normalizeRoles(u.roles ?? u.Roles);
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
      const all = Array.isArray(data) ? data.map(normalizeUser) : [];
      setUsers(all);
      setParticipants(all.filter((u) => !u.roles.includes(0) && !u.roles.includes(1)));
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
      setNotifications(list.filter((n) => (n.type ?? n.Type) === "ChallengeProposal" && !(n.isRead ?? n.IsRead)));
    } catch { }
  };

  useEffect(() => {
    loadUsers();
    loadLeagues();
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault(); setError("");
    const roleName = roleMap[Number(userForm.role)];
    try {
      const res = await fetch("http://localhost:5247/api/users", {
        method: "POST", headers,
        body: JSON.stringify({ Name: userForm.name, Surname: userForm.surname, Username: userForm.username, Password: userForm.password, Roles: [roleName], TotalPoints: 0 }),
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
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) { setError(err.message); }
  };

  const handleDeleteLeague = async (league) => {
    if (!window.confirm(`Eliminare la lega "${league.name}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5247/api/leagues/${league.id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Errore eliminazione lega");
      setLeagues((prev) => prev.filter((l) => l.id !== league.id));
    } catch (err) { setError(err.message); }
  };

  return (
    <>
      <style>{adminStyles}{pointRequestAdminStyles}{`
        /* ── Modal ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.15s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .modal-box {
          background: #111827;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6);
          width: 100%; max-width: 520px;
          max-height: 90vh;
          display: flex; flex-direction: column;
          animation: slideUp 0.18s ease;
        }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

        .modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }
        .modal-close {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5); border-radius: 8px;
          width: 30px; height: 30px; cursor: pointer; font-size: 0.7rem;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

        .modal-body {
          padding: 20px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-footer {
          padding: 14px 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
          flex-shrink: 0;
        }
        .modal-btn-cancel {
          padding: 10px 20px; border-radius: 8px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); font-family: inherit; font-size: 0.85rem;
          cursor: pointer; transition: all 0.15s;
        }
        .modal-btn-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }

        .modal-search-wrap {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 8px 12px;
          margin-bottom: 10px;
        }
        .modal-search-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #fff; font-size: 0.83rem; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .modal-search-input::placeholder { color: rgba(255,255,255,0.25); }
        .modal-search-clear {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.35); font-size: 0.7rem; padding: 0; line-height: 1;
        }

        .modal-participant-list {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px; overflow: hidden;
          max-height: 320px; overflow-y: auto;
        }
        /* Custom scrollbar per la lista partecipanti */
        .modal-participant-list::-webkit-scrollbar { width: 6px; }
        .modal-participant-list::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .modal-participant-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        .modal-empty {
          padding: 16px; text-align: center;
          font-size: 0.8rem; color: rgba(255,255,255,0.35);
        }
        .modal-participant-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: all 0.12s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .modal-participant-item:hover { background: rgba(255,255,255,0.04); transform: translateY(-1px); }
        .modal-participant-item--selected { 
           background: rgba(96,165,250,0.12) !important; 
           border-color: rgba(96,165,250,0.3) !important;
        }

        .modal-participant-check {
          width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0;
          border: 1.5px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 800; color: var(--ocean);
          transition: all 0.12s;
        }
        .modal-participant-item--selected .modal-participant-check {
          background: var(--ocean);
          border-color: var(--ocean);
          color: #000;
        }

        .modal-text-btn {
          background: none; border: none; cursor: pointer;
          font-size: 0.72rem; font-weight: 600; color: var(--ocean);
          font-family: inherit; padding: 2px 4px;
          transition: opacity 0.12s;
        }
        .modal-text-btn:hover { opacity: 0.7; }
        .modal-text-btn--danger { color: #f87171; }

        .selected-user-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 20px;
          background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.25);
          font-size: 0.75rem; font-weight: 600; color: var(--ocean);
        }
        .selected-user-chip button {
          background: none; border: none; color: var(--ocean);
          cursor: pointer; padding: 0; font-size: 0.75rem; line-height: 1;
          opacity: 0.7; transition: opacity 0.15s;
        }
        .selected-user-chip button:hover { opacity: 1; }

        .user-search-avatar {
          width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(96,165,250,0.2), rgba(251,191,36,0.15));
          border: 1px solid rgba(251,191,36,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 800; color: #fbbf24;
        }

        .create-league-trigger {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px; cursor: pointer;
          transition: background 0.15s;
        }
        .create-league-trigger:hover { background: rgba(255,255,255,0.02); }
      `}</style>

      {showCreateLeague && (
        <CreateLeagueModal
          participants={participants}
          onClose={() => setShowCreateLeague(false)}
          onCreated={loadLeagues}
          headers={headers}
        />
      )}

      <div className="adm-root">
        <div className="adm-content">

          <header className="adm-header">
            <div>
              <p className="adm-eyebrow">SummerSeason</p>
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
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>Clicca per vedere tutte le proposte</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {unreadCount > 0 && (
                  <span style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "var(--warning)", fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: 20 }}>
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
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>Clicca per vedere e gestire tutte le richieste</p>
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
                        <input className="adm-input" placeholder="Mario" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
                      </div>
                      <div className="adm-field">
                        <label className="adm-field-label">Cognome</label>
                        <input className="adm-input" placeholder="Rossi" value={userForm.surname} onChange={(e) => setUserForm({ ...userForm, surname: e.target.value })} required />
                      </div>
                      <div className="adm-field">
                        <label className="adm-field-label">Username</label>
                        <input className="adm-input" placeholder="mario.rossi" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} required />
                      </div>
                      <div className="adm-field">
                        <label className="adm-field-label">Password</label>
                        <input type="password" className="adm-input" placeholder="••••••••" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required />
                      </div>
                    </div>
                    <div className="adm-field" style={{ marginTop: "4px" }}>
                      <label className="adm-field-label">Ruolo</label>
                      <select className="dark-select" style={{ marginTop: "5px" }} value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                        {Object.keys(roleMap).filter((r) => r !== "3").map((r) => (
                          <option key={r} value={r}>{roleMap[r]}</option>
                        ))}
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
                      {displayedUsers.map((u) => (
                        <tr key={u.id} onClick={() => navigate(`/user/${u.id}`)}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <span className="adm-delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteUser(u); }}>✕</span>
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
                      {users.length > PREVIEW_COUNT && (
                          <div style={{ 
                            padding: "10px 16px", 
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                            display: "flex",
                            justifyContent: "center"
                          }}>
                            <button
                              className="modal-text-btn"
                              onClick={() => setShowAllUsers((prev) => !prev)}
                              style={{ fontSize: "0.75rem" }}
                            >
                              {showAllUsers ? "Mostra meno" : `Visualizza tutti (${users.length})`}
                            </button>
                          </div>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="adm-col">
              <div className="adm-card">
                <div className="create-league-trigger" onClick={() => setShowCreateLeague(true)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="adm-card-icon">🏅</div>
                    <div>
                      <h2 className="adm-card-title">Crea nuova lega</h2>
                      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                        {participants.length} partecipanti disponibili
                      </p>
                    </div>
                  </div>
                  <button className="adm-btn-primary" style={{ pointerEvents: "none" }}>
                    + Nuova lega
                  </button>
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
                      {leagues.map((l) => (
                        <tr key={l.id} onClick={() => navigate(`/league/${l.id}`)}>
                          <td>
                            <div className="adm-league-name">
                              <span className="adm-league-pip" />
                              {l.name}
                            </div>
                          </td>
                          <td className="muted">{new Date(l.creationDate).toLocaleDateString("it-IT")}</td>
                          <td>
                            <span className="adm-delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteLeague(l); }}>✕</span>
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