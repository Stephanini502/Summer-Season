import { useEffect, useState } from "react";
import { sharedStyles } from "../style/SharedStyles";

function ChallengesRefereePage() {
  const [challenges, setChallenges] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [bonusMalus, setBonusMalus] = useState([]);
  const [proposing, setProposing] = useState(null); // id sfida in modifica
  const [proposeForm, setProposeForm] = useState({ name: "", description: "", points: 0, leagueIds: [] });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const userId = parseInt(localStorage.getItem("userId"));
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchChallenges = async () => {
    try {
      const leaguesRes = await fetch(`http://localhost:5247/api/leagues/referee/${userId}`, { headers });
      if (!leaguesRes.ok) { setChallenges([]); return; }
      const leaguesRaw = await leaguesRes.json();
      const myLeagues = Array.isArray(leaguesRaw) ? leaguesRaw : leaguesRaw.$values ?? [];
      setLeagues(myLeagues.map(l => ({ ...l, id: Number(l.id ?? l.Id) })));

      const allChallenges = await Promise.all(
        myLeagues.map(async (league) => {
          const res = await fetch(`http://localhost:5247/api/challenges/${league.id ?? league.Id}`, { headers });
          if (!res.ok) return [];
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.$values ?? [];
          return list.map(c => ({
            ...c,
            leagueIds: c.leagueIds?.$values ?? c.leagueIds ?? [],
            leagueName: c.leagueName || league.name || league.Name
          }));
        })
      );

      const seen = new Set();
      const unique = allChallenges.flat().filter(c => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
      setChallenges(unique);
    } catch { setChallenges([]); }
  };

  const fetchBonusMalus = async () => {
    try {
      const res = await fetch("http://localhost:5247/api/bonusmalus", { headers });
      if (!res.ok) return;
      const data = await res.json();
      const raw = Array.isArray(data) ? data : data.$values ?? [];
      setBonusMalus(raw.map(b => ({
        id: b.id ?? b.Id,
        name: b.name ?? b.Name ?? "",
        description: b.description ?? b.Description ?? "",
        points: b.points ?? b.Points ?? 0,
        type: (b.type ?? b.Type ?? "").toLowerCase()
      })));
    } catch { }
  };

  useEffect(() => { fetchChallenges(); fetchBonusMalus(); }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(t);
  }, [message]);

  const startPropose = (challenge) => {
    setProposing(challenge.id);
    setProposeForm({
      name: challenge.name || "",
      description: challenge.description || "",
      points: challenge.points || 0,
      leagueIds: Array.isArray(challenge.leagueIds) ? challenge.leagueIds : []
    });
  };

  const cancelPropose = () => {
    setProposing(null);
    setProposeForm({ name: "", description: "", points: 0, leagueIds: [] });
  };

  const handlePropose = async (e) => {
    e.preventDefault();
    if (!proposing) return;
    setSending(true);
    try {
      const res = await fetch(`http://localhost:5247/api/challenges/${proposing}/propose`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          Name: proposeForm.name,
          Description: proposeForm.description,
          Points: parseInt(proposeForm.points) || 0,
          LeagueIds: proposeForm.leagueIds
        })
      });
      if (!res.ok) throw new Error("Errore invio proposta");
      setMessage({ type: "success", text: "Proposta inviata agli admin ✓" });
      cancelPropose();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSending(false);
    }
  };

  const bonus = bonusMalus.filter(b => b.type === "bonus");
  const malus = bonusMalus.filter(b => b.type === "malus");

  return (
    <>
      <style>{sharedStyles}{`
        .ref-alert-success {
          background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25);
          color: var(--success); border-radius: var(--radius-sm);
          padding: 13px 18px; font-size: 0.83rem; font-weight: 500;
          margin-bottom: 24px; display: flex; align-items: center; gap: 8px;
          animation: pgFadeDown 0.3s ease both;
        }
        .ref-alert-error {
          background: var(--danger-light); border: 1px solid rgba(248,113,113,0.25);
          color: var(--danger); border-radius: var(--radius-sm);
          padding: 13px 18px; font-size: 0.83rem; font-weight: 500;
          margin-bottom: 24px; display: flex; align-items: center; gap: 8px;
        }
        .propose-banner {
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: var(--radius-sm);
          padding: 10px 14px; margin-bottom: 16px;
          font-size: 0.78rem; color: var(--warning);
          display: flex; align-items: center; gap: 8px;
        }
      `}</style>

      <div className="pg-root">
        <div className="pg-content">

          <header className="pg-header">
            <div>
              <p className="pg-eyebrow">SummerSeason</p>
              <h1 className="pg-title">Sfide — Vista Arbitro</h1>
            </div>
          </header>

          {message && (
            <div className={message.type === "success" ? "ref-alert-success" : "ref-alert-error"}>
              <span>{message.type === "success" ? "✓" : "⚠️"}</span> {message.text}
            </div>
          )}

          <div className="pg-stats">
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Sfide nelle tue leghe</p><p className="pg-stat-value">{challenges.length}</p></div>
              <div className="pg-stat-icon">🏁</div>
            </div>
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Le tue leghe</p><p className="pg-stat-value">{leagues.length}</p></div>
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
                  <div className="pg-card-icon">{proposing ? "✏️" : "📋"}</div>
                  <h2 className="pg-card-title">
                    {proposing ? "Proponi modifica sfida" : "Seleziona una sfida da modificare"}
                  </h2>
                </div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                {!proposing ? (
                  <div className="pg-empty" style={{ padding: "32px 0" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>✏️</div>
                    <p style={{ color: "var(--text)", fontWeight: 600, marginBottom: 4 }}>
                      Nessuna sfida selezionata
                    </p>
                    <p>Clicca ✏️ su una sfida per proporre una modifica</p>
                  </div>
                ) : (
                  <>
                    <div className="propose-banner">
                      ⚠️ La modifica verrà inviata agli admin per approvazione — non sarà applicata subito
                    </div>
                    <form onSubmit={handlePropose}>
                      <div className="pg-field">
                        <label className="pg-field-label">Nome</label>
                        <input className="pg-input" value={proposeForm.name}
                          onChange={e => setProposeForm({ ...proposeForm, name: e.target.value })} required />
                      </div>
                      <div className="pg-field">
                        <label className="pg-field-label">Descrizione</label>
                        <textarea className="pg-textarea" value={proposeForm.description}
                          onChange={e => setProposeForm({ ...proposeForm, description: e.target.value })} required />
                      </div>
                      <div className="pg-field">
                        <label className="pg-field-label">Punti</label>
                        <input type="number" className="pg-input" min="0" value={proposeForm.points}
                          onChange={e => setProposeForm({ ...proposeForm, points: e.target.value })} required />
                      </div>
                      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button
                          type="submit"
                          className="pg-btn pg-btn-warning"
                          style={{ flex: 1 }}
                          disabled={sending}
                        >
                          {sending ? "⏳ Invio..." : "📨 Invia proposta agli admin"}
                        </button>
                        <button type="button" className="pg-btn pg-btn-ghost" onClick={cancelPropose}>
                          Annulla
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            <div className="pg-card" style={{ marginBottom: 0 }}>
              <div className="pg-card-header">
                <div className="pg-card-header-left">
                  <div className="pg-card-icon">📋</div>
                  <h2 className="pg-card-title">Sfide delle tue leghe</h2>
                </div>
                <span className="pg-badge pg-badge-blue">{challenges.length}</span>
              </div>
              <div className="pg-table-wrap">
                <table className="pg-table">
                  <thead>
                    <tr><th>Nome</th><th>Punti</th><th>Lega</th><th>Azioni</th></tr>
                  </thead>
                  <tbody>
                    {challenges.length === 0 && (
                      <tr><td colSpan="4"><div className="pg-empty">Nessuna sfida</div></td></tr>
                    )}
                    {challenges.map(c => (
                      <tr key={c.id} style={{ background: proposing === c.id ? "rgba(245,158,11,0.05)" : undefined }}>
                        <td>
                          <div style={{ fontWeight: 600, color: "var(--text)" }}>{c.name}</div>
                          <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: 2 }}>{c.description}</div>
                        </td>
                        <td><span className="pg-badge pg-badge-green">+{c.points}</span></td>
                        <td>
                          {c.leagueName
                            ? <span className="pg-badge pg-badge-sun" style={{ fontSize: "0.62rem" }}>{c.leagueName}</span>
                            : <span style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>—</span>}
                        </td>
                        <td>
                          <button
                            className="pg-btn pg-btn-warning pg-btn-sm"
                            onClick={() => startPropose(c)}
                            title="Proponi modifica"
                          >
                            ✏️
                          </button>
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
                <h2 className="pg-card-title">Bonus & Malus attivi</h2>
              </div>
              <span className="pg-badge pg-badge-blue">{bonusMalus.length} modificatori</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              <div style={{ borderRight: "1px solid var(--border)", padding: "16px 24px" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--success)", marginBottom: 12 }}>
                  ⬆ Bonus ({bonus.length})
                </p>
                {bonus.length === 0
                  ? <div className="pg-empty" style={{ padding: "16px 0" }}>Nessun bonus</div>
                  : bonus.map(b => (
                    <div key={b.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{b.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{b.description}</div>
                      </div>
                      <span className="pg-badge pg-badge-green">+{b.points} pts</span>
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
                    <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{m.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{m.description}</div>
                      </div>
                      <span className="pg-badge pg-badge-red">{m.points} pts</span>
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

export default ChallengesRefereePage;