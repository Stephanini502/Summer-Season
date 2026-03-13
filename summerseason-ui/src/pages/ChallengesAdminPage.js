import { useEffect, useState } from "react";
import { sharedStyles } from "../style/SharedStyles";

function ChallengesAdminPage() {
  const [challenges, setChallenges] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [newChallenge, setNewChallenge] = useState({ name: "", description: "", points: 0, leagueIds: [] });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchChallenges = async () => {
      try {
        if (!token) return;
        const response = await fetch("http://localhost:5247/api/challenges", { headers });
        if (!response.ok) { setChallenges([]); return; }
        const data = await response.json();
        let challenges = Array.isArray(data) ? data : data.$values ?? [];
        
        challenges = challenges.map(c => ({
          ...c,
          leagueIds: c.leagueIds?.$values ?? c.leagueIds ?? []
        }));
        
        setChallenges(challenges);
      } catch (err) { setChallenges([]); }
  };
  const fetchLeagues = async () => {
      try {
        if (!token) return;
        const response = await fetch("http://localhost:5247/api/leagues", { headers });
        if (!response.ok) { setLeagues([]); return; }
        const data = await response.json();
        let leaguesData = Array.isArray(data) ? data : data.$values ?? [];
        leaguesData = leaguesData.map(l => ({ ...l, id: Number(l.id ?? l.Id) }));
        setLeagues(leaguesData);
      } catch (err) { setLeagues([]); }
  };

  useEffect(() => { fetchChallenges(); fetchLeagues(); }, []);

  const toggleLeague = (leagueId) => {
    setNewChallenge(prev => ({
      ...prev,
      leagueIds: prev.leagueIds.includes(leagueId)
        ? prev.leagueIds.filter(id => id !== leagueId)
        : [...prev.leagueIds, leagueId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (newChallenge.leagueIds.length === 0) {
      alert("Seleziona almeno una lega.");
      return;
    }
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5247/api/challenges/${editingId}`
      : "http://localhost:5247/api/challenges";
    try {
      const res = await fetch(url, {
        method, headers,
        body: JSON.stringify({
          Name: newChallenge.name,
          Description: newChallenge.description,
          Points: parseInt(newChallenge.points) || 0,
          LeagueIds: newChallenge.leagueIds
        })
      });
      if (!res.ok) return;
      setNewChallenge({ name: "", description: "", points: 0, leagueIds: [] });
      setEditingId(null);
      fetchChallenges();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!token || !window.confirm("Eliminare questa sfida?")) return;
    try {
      await fetch(`http://localhost:5247/api/challenges/${id}`, { method: "DELETE", headers });
      fetchChallenges();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (challenge) => {
    setEditingId(challenge.id);
    setNewChallenge({
      name: challenge.name || "",
      description: challenge.description || "",
      points: challenge.points || 0,
      leagueIds: Array.isArray(challenge.leagueIds)
        ? challenge.leagueIds
        : challenge.leagueId
          ? [challenge.leagueId]
          : []
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewChallenge({ name: "", description: "", points: 0, leagueIds: [] });
  };

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root">
        <div className="pg-content">

          <header className="pg-header">
            <div>
              <p className="pg-eyebrow">SummerSeason Platform</p>
              <h1 className="pg-title">Gestione Sfide</h1>
            </div>
          </header>

          <div className="pg-stats">
            <div className="pg-stat-card">
              <div>
                <p className="pg-stat-label">Sfide totali</p>
                <p className="pg-stat-value">{challenges.length}</p>
              </div>
              <div className="pg-stat-icon">🏁</div>
            </div>
            <div className="pg-stat-card">
              <div>
                <p className="pg-stat-label">Leghe attive</p>
                <p className="pg-stat-value">{leagues.length}</p>
              </div>
              <div className="pg-stat-icon pg-stat-icon-green">🏆</div>
            </div>
          </div>

          <div className="pg-grid-2" style={{ alignItems: "start" }}>

            <div className="pg-card" style={{ marginBottom: 0 }}>
              <div className="pg-card-header">
                <div className="pg-card-header-left">
                  <div className="pg-card-icon">{editingId ? "✏️" : "➕"}</div>
                  <h2 className="pg-card-title">{editingId ? "Modifica sfida" : "Nuova sfida"}</h2>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <form onSubmit={handleSubmit}>

                  <div className="pg-field">
                    <label className="pg-field-label">Nome</label>
                    <input className="pg-input" placeholder="Es. Corri 5km" value={newChallenge.name}
                      onChange={e => setNewChallenge({ ...newChallenge, name: e.target.value })} required />
                  </div>

                  <div className="pg-field">
                    <label className="pg-field-label">Descrizione</label>
                    <textarea className="pg-textarea" placeholder="Descrivi la sfida..." value={newChallenge.description}
                      onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })} required />
                  </div>

                  <div className="pg-field">
                    <label className="pg-field-label">Punti</label>
                    <input type="number" className="pg-input" min="0" value={newChallenge.points}
                      onChange={e => setNewChallenge({ ...newChallenge, points: e.target.value })} required />
                  </div>

                  <div className="pg-field">
                    <label className="pg-field-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      Leghe
                      {newChallenge.leagueIds.length > 0 && (
                        <span style={{
                          fontSize: "0.63rem", fontWeight: 700,
                          background: "var(--sun-light)", border: "1px solid var(--sun-mid)",
                          color: "var(--sun-dark)", padding: "2px 8px", borderRadius: 20
                        }}>
                          {newChallenge.leagueIds.length} selezionate
                        </span>
                      )}
                    </label>

                    {leagues.length === 0 ? (
                      <p style={{ fontSize: "0.78rem", color: "var(--text-light)", paddingTop: 6 }}>
                        Nessuna lega disponibile
                      </p>
                    ) : (
                      <div style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7,
                        maxHeight: 200, overflowY: "auto", paddingRight: 2
                      }}>
                        {leagues.map(l => {
                          const selected = newChallenge.leagueIds.includes(l.id);
                          return (
                            <label key={l.id} onClick={() => toggleLeague(l.id)} style={{
                              display: "flex", alignItems: "center", gap: 8,
                              padding: "8px 11px",
                              background: selected ? "var(--sun-light)" : "#f9faff",
                              border: `1px solid ${selected ? "var(--sun)" : "var(--border)"}`,
                              borderRadius: "var(--radius-sm)",
                              cursor: "pointer", transition: "all 0.15s", userSelect: "none"
                            }}>
                              <input type="checkbox" readOnly checked={selected}
                                style={{ accentColor: "var(--sun-dark)", width: 13, height: 13, flexShrink: 0 }} />
                              <span style={{
                                fontSize: "0.78rem", fontWeight: 500, color: "var(--text)",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                              }}>
                                {l.name}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button type="submit"
                      className={`pg-btn ${editingId ? "pg-btn-warning" : "pg-btn-primary"}`}
                      style={{ flex: 1 }}>
                      {editingId ? "✓ Aggiorna" : "+ Aggiungi sfida"}
                    </button>
                    {editingId && (
                      <button type="button" className="pg-btn pg-btn-ghost" onClick={cancelEdit}>Annulla</button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="pg-card" style={{ marginBottom: 0 }}>
              <div className="pg-card-header">
                <div className="pg-card-header-left">
                  <div className="pg-card-icon">📋</div>
                  <h2 className="pg-card-title">Sfide esistenti</h2>
                </div>
              </div>
              <div className="pg-table-wrap">
                <table className="pg-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Punti</th>
                      <th>Leghe</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challenges.length === 0 && (
                      <tr><td colSpan="4"><div className="pg-empty">Nessuna sfida</div></td></tr>
                    )}
                    {Array.isArray(challenges) && challenges.map(c => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>
                            {c.description}
                          </div>
                        </td>
                        <td>
                          <span className="pg-badge pg-badge-green">+{c.points}</span>
                        </td>
                        <td>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {Array.isArray(c.leagueIds) && c.leagueIds.length > 0
                              ? c.leagueIds.map(lid => {
                                  const league = leagues.find(l => l.id === lid);
                                  return league
                                    ? <span key={lid} className="pg-badge pg-badge-sun"
                                        style={{ fontSize: "0.62rem" }}>{league.name}</span>
                                    : null;
                                })
                              : <span style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>—</span>
                            }
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="pg-btn pg-btn-warning pg-btn-sm" onClick={() => handleEdit(c)}>✏️</button>
                            <button className="pg-btn pg-btn-danger pg-btn-sm" onClick={() => handleDelete(c.id)}>✕</button>
                          </div>
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
    </>
  );
}

export default ChallengesAdminPage;