import { useEffect, useRef, useState } from "react";
import { sharedStyles } from "../style/SharedStyles";
import { darkPatch } from "../style/DarkPatch";

function LeagueSearch({ leagues, selected, onToggle }) {
  const [search, setSearch] = useState("");

  const filtered = leagues.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  // Selezionate in cima
  const sorted = [
    ...filtered.filter(l => selected.includes(l.id)),
    ...filtered.filter(l => !selected.includes(l.id)),
  ];

  return (
    <div>
      {/* Input ricerca */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "var(--radius-sm)",
        padding: "7px 11px",
        marginBottom: 8,
      }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0 }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filtra leghe..."
          style={{
            background: "transparent", border: "none", outline: "none",
            padding: 0, fontSize: "0.82rem", color: "var(--text)", width: "100%",
          }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: 0, fontSize: "0.75rem", lineHeight: 1,
            }}
          >✕</button>
        )}
      </div>

      {/* Lista checkbox filtrata */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 5,
        maxHeight: 200, overflowY: "auto", paddingRight: 4,
      }}>
        {sorted.length === 0 && (
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", padding: "6px 0" }}>
            Nessuna lega trovata per &quot;{search}&quot;
          </p>
        )}
        {sorted.map(l => {
          const isSelected = selected.includes(l.id);
          return (
            <label
              key={l.id}
              onClick={() => onToggle(l.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 11px",
                background: isSelected ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isSelected ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "var(--radius-sm)",
                cursor: "pointer", transition: "all 0.15s", userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                readOnly
                checked={isSelected}
                style={{ accentColor: "var(--sun-dark)", width: 13, height: 13, flexShrink: 0 }}
              />
              <span style={{
                fontSize: "0.78rem", fontWeight: 500, color: "var(--text)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {l.name}
              </span>
              {isSelected && (
                <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "var(--sun-dark)", fontWeight: 700 }}>
                  ✓
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function ChallengesAdminPage() {
  const [challenges, setChallenges] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [bonusMalus, setBonusMalus] = useState([]);
  const [newChallenge, setNewChallenge] = useState({ name: "", description: "", points: 0, leagueIds: [] });
  const [editingId, setEditingId] = useState(null);
  const [reloading, setReloading] = useState(false);

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

  const fetchBonusMalus = async () => {
    try {
      const res = await fetch("http://localhost:5247/api/bonusmalus", { headers });
      if (!res.ok) { setBonusMalus([]); return; }
      const data = await res.json();
      console.log("BonusMalus data:", data);
      setBonusMalus(Array.isArray(data) ? data : data.$values ?? []);
    } catch { setBonusMalus([]); }
  };

  const handleReloadJson = async () => {
    setReloading(true);
    try {
      const res = await fetch("http://localhost:5247/api/bonusmalus/reload", { method: "POST", headers });
      if (!res.ok) throw new Error("Errore reload");
      await fetchBonusMalus();
    } catch (err) { alert(err.message); }
    finally { setReloading(false); }
  };

  const handleDeleteBonusMalus = async (id) => {
    if (!window.confirm("Eliminare questo bonus/malus?")) return;
    try {
      await fetch(`http://localhost:5247/api/bonusmalus/${id}`, { method: "DELETE", headers });
      await fetchBonusMalus();
    } catch (err) { alert(err.message); }
  };

  useEffect(() => { fetchChallenges(); fetchLeagues(); fetchBonusMalus(); }, []);

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
    if (newChallenge.leagueIds.length === 0) { alert("Seleziona almeno una lega."); return; }
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
      leagueIds: Array.isArray(challenge.leagueIds) ? challenge.leagueIds : challenge.leagueId ? [challenge.leagueId] : []
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewChallenge({ name: "", description: "", points: 0, leagueIds: [] });
  };

  const bonus = bonusMalus.filter(b => b.type === "Bonus");
  const malus = bonusMalus.filter(b => b.type === "Malus");

  return (
    <>
      <style>{sharedStyles}{darkPatch}</style>
      <div className="pg-root">
        <div className="pg-content">

          <header className="pg-header">
            <div>
              <p className="pg-eyebrow">SummerSeason</p>
              <h1 className="pg-title">Gestione Sfide</h1>
            </div>
          </header>

          <div className="pg-stats">
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Sfide totali</p><p className="pg-stat-value">{challenges.length}</p></div>
              <div className="pg-stat-icon">🏁</div>
            </div>
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Leghe attive</p><p className="pg-stat-value">{leagues.length}</p></div>
              <div className="pg-stat-icon pg-stat-icon-green">🏆</div>
            </div>
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Bonus</p><p className="pg-stat-value">{bonus.length}</p></div>
              <div className="pg-stat-icon pg-stat-icon-sun">⭐</div>
            </div>
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Malus</p><p className="pg-stat-value">{malus.length}</p></div>
              <div className="pg-stat-icon" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>💀</div>
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

                  {/* Campo Leghe con ricerca inline */}
                  <div className="pg-field">
                    <label className="pg-field-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      Leghe
                      {newChallenge.leagueIds.length > 0 && (
                        <span className="pg-badge pg-badge-sun" style={{ fontSize: "0.63rem" }}>
                          {newChallenge.leagueIds.length} selezionate
                        </span>
                      )}
                    </label>
                    {leagues.length === 0 ? (
                      <p style={{ fontSize: "0.78rem", color: "var(--text-light)", paddingTop: 6 }}>
                        Nessuna lega disponibile
                      </p>
                    ) : (
                      <LeagueSearch
                        leagues={leagues}
                        selected={newChallenge.leagueIds}
                        onToggle={toggleLeague}
                      />
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button type="submit" className={`pg-btn ${editingId ? "pg-btn-warning" : "pg-btn-primary"}`} style={{ flex: 1 }}>
                      {editingId ? "✓ Aggiorna" : "+ Aggiungi sfida"}
                    </button>
                    {editingId && <button type="button" className="pg-btn pg-btn-ghost" onClick={cancelEdit}>Annulla</button>}
                  </div>
                </form>
              </div>
            </div>

            <div className="pg-card" style={{ marginBottom: 0 }}>
              <div className="pg-card-header">
                <div className="pg-card-header-left"><div className="pg-card-icon">📋</div><h2 className="pg-card-title">Sfide esistenti</h2></div>
              </div>
              <div className="pg-table-wrap">
                <table className="pg-table">
                  <thead>
                    <tr><th>Nome</th><th>Punti</th><th>Leghe</th><th>Azioni</th></tr>
                  </thead>
                  <tbody>
                    {challenges.length === 0 && <tr><td colSpan="4"><div className="pg-empty">Nessuna sfida</div></td></tr>}
                    {challenges.map(c => (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--text)" }}>{c.name}</div>
                          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>{c.description}</div>
                        </td>
                        <td><span className="pg-badge pg-badge-green">+{c.points}</span></td>
                        <td>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {Array.isArray(c.leagueIds) && c.leagueIds.length > 0
                              ? c.leagueIds.map(lid => {
                                  const league = leagues.find(l => l.id === lid);
                                  return league ? <span key={lid} className="pg-badge pg-badge-sun" style={{ fontSize: "0.62rem" }}>{league.name}</span> : null;
                                })
                              : <span style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>—</span>}
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

          <div className="pg-card" style={{ marginTop: 20, marginBottom: 0 }}>
            <div className="pg-card-header">
              <div className="pg-card-header-left">
                <div className="pg-card-icon">⭐</div>
                <h2 className="pg-card-title">Bonus & Malus</h2>
              </div>
              <button
                className="pg-btn pg-btn-ghost pg-btn-sm"
                onClick={handleReloadJson}
                disabled={reloading}
              >
                {reloading ? "⏳ Ricaricando..." : "🔄 Ricarica da JSON"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>

              <div style={{ borderRight: "1px solid var(--border)", padding: "16px 24px" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--success)", marginBottom: 12 }}>
                  ⬆ Bonus ({bonus.length})
                </p>
                {bonus.length === 0
                  ? <div className="pg-empty" style={{ padding: "16px 0" }}>Nessun bonus</div>
                  : bonus.map(b => (
                    <div key={b.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 0", borderBottom: "1px solid var(--border)"
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{b.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{b.description}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <span className="pg-badge pg-badge-green">+{b.points} pts</span>
                        <button className="pg-btn pg-btn-danger pg-btn-sm" style={{ padding: "4px 8px" }}
                          onClick={() => handleDeleteBonusMalus(b.id)}>✕</button>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div style={{ padding: "16px 24px" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--danger)", marginBottom: 12 }}>
                  ⬇ Malus ({malus.length})
                </p>
                {malus.length === 0
                  ? <div className="pg-empty" style={{ padding: "16px 0" }}>Nessun malus</div>
                  : malus.map(m => (
                    <div key={m.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 0", borderBottom: "1px solid var(--border)"
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{m.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{m.description}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <span className="pg-badge pg-badge-red">{m.points} pts</span>
                        <button className="pg-btn pg-btn-danger pg-btn-sm" style={{ padding: "4px 8px" }}
                          onClick={() => handleDeleteBonusMalus(m.id)}>✕</button>
                      </div>
                    </div>
                  ))
                }
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ChallengesAdminPage;