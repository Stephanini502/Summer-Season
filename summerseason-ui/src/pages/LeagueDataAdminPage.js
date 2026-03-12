import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sharedStyles } from "../style/SharedStyles";

function LeagueDataAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [league, setLeague] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRefereeId, setSelectedRefereeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("jwtToken");
  const refereeRole = "Referee";

  const normalizeValues = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };

  const normalizeUser = (u) => ({
    id: u.id ?? u.Id,
    name: u.name ?? u.Name ?? "",
    surname: u.surname ?? u.Surname ?? "",
    userName: u.userName ?? u.UserName ?? "",
    roles: Array.isArray(u.roles ?? u.Roles) ? (u.roles ?? u.Roles).map(r => r.toString()) : [],
    totalPoints: u.totalPoints ?? u.TotalPoints ?? 0,
  });

  const referees = (participants || []).filter(u => userRoles[u.id] && userRoles[u.id].includes(refereeRole));

  const loadRolesForParticipants = async (users) => {
    const rolesMap = {};
    await Promise.all(users.map(async (u) => {
      try {
        const res = await fetch(`http://localhost:5247/api/users/${u.id}/roles`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          let roles = await res.json();
          if (roles && roles.$values) roles = roles.$values;
          rolesMap[u.id] = Array.isArray(roles) ? roles.map(r => r.toString()) : [];
        } else { rolesMap[u.id] = []; }
      } catch { rolesMap[u.id] = []; }
    }));
    setUserRoles(rolesMap);
  };

  const fetchLeagueData = async () => {
    if (!id) return;
    setLoading(true); setError("");
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
    const safeJson = async (r) => { if (!r.ok) throw new Error(`Errore API (${r.status})`); const t = await r.text(); return t ? JSON.parse(t) : null; };
    try {
      const [leagueData, participantsData, rankingData, usersData] = await Promise.all([
        fetch(`http://localhost:5247/api/leagues/${id}`, { headers }).then(safeJson),
        fetch(`http://localhost:5247/api/leagues/${id}/participants`, { headers }).then(safeJson),
        fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers }).then(safeJson),
        fetch(`http://localhost:5247/api/users`, { headers }).then(safeJson),
      ]);
      setLeague(leagueData);
      const np = normalizeValues(participantsData).map(normalizeUser);
      setParticipants(np);
      setRanking(normalizeValues(rankingData).map(normalizeUser));
      setAllUsers(normalizeValues(usersData).map(normalizeUser));
      if (np.length > 0) loadRolesForParticipants(np);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeagueData(); }, [id]);

  const refreshParticipantsAndRanking = () => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`http://localhost:5247/api/leagues/${id}/participants`, { headers })
      .then(r => r.json()).then(data => { const n = normalizeValues(data).map(normalizeUser); setParticipants(n); loadRolesForParticipants(n); }).catch(console.error);
    fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers })
      .then(r => r.json()).then(data => setRanking(normalizeValues(data).map(normalizeUser))).catch(console.error);
  };

  const handleAddParticipant = () => {
    if (!selectedUserId) return;
    fetch(`http://localhost:5247/api/leagues/${id}/participants/${selectedUserId}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (!res.ok) throw new Error("Errore aggiunta"); setSelectedUserId(""); refreshParticipantsAndRanking(); })
      .catch(err => alert(err.message));
  };

  const handleRemoveParticipant = async (uid) => {
    if (!window.confirm("Rimuovere questo partecipante?")) return;
    try {
      const res = await fetch(`http://localhost:5247/api/leagues/${id}/${uid}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Errore rimozione");
      refreshParticipantsAndRanking();
    } catch (err) { alert(err.message); }
  };

  const handleSetReferee = () => {
    if (!selectedRefereeId) return;
    fetch(`http://localhost:5247/api/users/${selectedRefereeId}/${refereeRole}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (!res.ok) throw new Error("Errore assegnazione"); setSelectedRefereeId(""); refreshParticipantsAndRanking(); })
      .catch(err => alert(err.message));
  };

  const rankClass = (i) => i === 0 ? "pg-rank pg-rank-1" : i === 1 ? "pg-rank pg-rank-2" : i === 2 ? "pg-rank pg-rank-3" : "pg-rank";

  if (loading) return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root"><div className="pg-loading"><div className="pg-spinner" /></div></div>
    </>
  );

  if (error) return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root"><div className="pg-alert pg-alert-danger">⚠️ {error}</div></div>
    </>
  );

  if (!league) return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root"><div className="pg-empty">Lega non trovata</div></div>
    </>
  );

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root">
        <div className="pg-content">

          <div className="pg-hero">
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>Admin · Gestione Lega</p>
              <h1 className="pg-hero-title">{league.name}</h1>
              <p className="pg-hero-sub">Creata il {new Date(league.creationDate).toLocaleDateString("it-IT")}</p>
            </div>
            <button className="pg-btn-hero" onClick={() => navigate("/challenges")}>🏁 Vai alle sfide</button>
          </div>

          <div className="pg-stats">
            <div className="pg-stat-card">
              <div>
                <p className="pg-stat-label">Partecipanti</p>
                <p className="pg-stat-value">{participants.length}</p>
              </div>
              <div className="pg-stat-icon">👥</div>
            </div>
            <div className="pg-stat-card">
              <div>
                <p className="pg-stat-label">Arbitri</p>
                <p className="pg-stat-value">{referees.length}</p>
              </div>
              <div className="pg-stat-icon pg-stat-icon-yellow">🟡</div>
            </div>
          </div>

          <div className="pg-grid-sidebar" style={{ alignItems: "start" }}>

            <div className="pg-col" style={{ gap: 20 }}>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">ℹ️</div>
                    <h2 className="pg-card-title">Informazioni</h2>
                  </div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <div className="pg-info-row">
                    <span className="pg-info-row-label">Partecipanti</span>
                    <span className="pg-info-row-value">{participants.length}</span>
                  </div>
                  <div className="pg-info-row">
                    <span className="pg-info-row-label">Creazione</span>
                    <span className="pg-info-row-value">{new Date(league.creationDate).toLocaleDateString("it-IT")}</span>
                  </div>
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon pg-stat-icon-yellow" style={{ width: 28, height: 28, borderRadius: 7, background: "var(--warning-light)", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center" }}>🟡</div>
                    <h2 className="pg-card-title">Arbitri assegnati</h2>
                  </div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  {referees.length > 0 ? referees.map(r => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div className="pg-avatar" style={{ width: 36, height: 36, fontSize: "0.9rem", margin: 0 }}>{r.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{r.name} {r.surname}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{r.userName}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="pg-empty" style={{ padding: "16px 0" }}>Nessun arbitro assegnato</div>
                  )}
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">⚖️</div>
                    <h2 className="pg-card-title">Assegna arbitro</h2>
                  </div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <div className="pg-field">
                    <label className="pg-field-label">Seleziona partecipante</label>
                    <select className="pg-select" value={selectedRefereeId} onChange={e => setSelectedRefereeId(e.target.value)}>
                      <option value="">Scegli...</option>
                      {(participants || []).map(u => (
                        <option key={u.id} value={u.id}>{u.name} {u.surname} ({u.userName})</option>
                      ))}
                    </select>
                  </div>
                  <button className="pg-btn pg-btn-warning" style={{ width: "100%" }} onClick={handleSetReferee}>⚖️ Assegna come arbitro</button>
                </div>
              </div>
            </div>

            <div className="pg-col" style={{ gap: 20 }}>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">➕</div>
                    <h2 className="pg-card-title">Aggiungi partecipante</h2>
                  </div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <div className="pg-inline-form">
                    <select className="pg-select" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                      <option value="">Seleziona utente...</option>
                      {(allUsers || []).map(u => (
                        <option key={u.id} value={u.id}>{u.name} {u.surname} ({u.userName})</option>
                      ))}
                    </select>
                    <button className="pg-btn pg-btn-primary" onClick={handleAddParticipant}>Aggiungi</button>
                  </div>
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">👥</div>
                    <h2 className="pg-card-title">Partecipanti</h2>
                  </div>
                </div>
                <div className="pg-table-wrap">
                  <table className="pg-table">
                    <thead>
                      <tr><th>Nome</th><th>Username</th><th>Punti</th><th></th></tr>
                    </thead>
                    <tbody>
                      {(participants || []).length === 0 && (
                        <tr><td colSpan="4"><div className="pg-empty">Nessun partecipante</div></td></tr>
                      )}
                      {(participants || []).map(u => (
                        <tr key={u.id} className="clickable" onClick={() => navigate(`/user/${u.id}`)}>
                          <td className="bold">{u.name || "—"} {u.surname || ""}</td>
                          <td className="muted">{u.userName || "—"}</td>
                          <td><span className="pg-badge pg-badge-blue">{u.totalPoints || 0}</span></td>
                          <td>
                            <button className="pg-btn pg-btn-danger pg-btn-sm"
                              onClick={e => { e.stopPropagation(); handleRemoveParticipant(u.id); }}>Rimuovi</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">🏆</div>
                    <h2 className="pg-card-title">Classifica lega</h2>
                  </div>
                </div>
                <ul className="pg-list">
                  {(ranking || []).length === 0 && <li><div className="pg-empty">Nessun dato classifica</div></li>}
                  {(ranking || []).map((u, index) => (
                    <li key={index} className="pg-list-item">
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className={rankClass(index)}>{index + 1}</span>
                        <div>
                          <div className="pg-list-item-name">{u.name || "—"} {u.surname || ""}</div>
                          <div className="pg-list-item-sub">{u.userName || "—"}</div>
                        </div>
                      </div>
                      <span className="pg-badge pg-badge-blue">{u.totalPoints || 0} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeagueDataAdminPage;
