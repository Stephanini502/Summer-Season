import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminStyles } from "../style/SharedStyles";

function RefereePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const userId = parseInt(localStorage.getItem("userId"));

  const [requests, setRequests] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [note, setNote] = useState({});
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, leagueRes] = await Promise.all([
        fetch(`http://localhost:5247/api/pointrequests/pending/referee/${userId}`, { headers }),
        fetch(`http://localhost:5247/api/leagues/referee/${userId}`, { headers }) 
      ]);

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests(Array.isArray(data) ? data : data.$values ?? []);
      }

      if (leagueRes.ok) {
        const data = await leagueRes.json();
        setLeagues(Array.isArray(data) ? data : data.$values ?? []);
      }

    } catch {
      setMessage({ type: "error", text: "Errore caricamento dati" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const approve = async (id) => {
    setActing(id);
    try {
      const res = await fetch(`http://localhost:5247/api/pointrequests/${id}/approve`, {
        method: "PUT", headers,
        body: JSON.stringify({ adminNote: note[id] || "" })
      });
      if (!res.ok) throw new Error();
      setRequests(prev => prev.filter(r => r.id !== id));
      setMessage({ type: "success", text: "Richiesta approvata ✓" });
    } catch {
      setMessage({ type: "error", text: "Errore approvazione" });
    } finally { setActing(null); }
  };

  const reject = async (id) => {
    setActing(id);
    try {
      const res = await fetch(`http://localhost:5247/api/pointrequests/${id}/reject`, {
        method: "PUT", headers,
        body: JSON.stringify({ adminNote: note[id] || "" })
      });
      if (!res.ok) throw new Error();
      setRequests(prev => prev.filter(r => r.id !== id));
      setMessage({ type: "success", text: "Richiesta rifiutata" });
    } catch {
      setMessage({ type: "error", text: "Errore rifiuto" });
    } finally { setActing(null); }
  };

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const pending = requests.filter(r => r.status === "Pending" || !r.status);

  return (
    <>
      <style>{adminStyles}{`
        .ref-tabs {
          display: flex; gap: 4px; padding: 4px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          margin-bottom: 24px;
        }
        .ref-tab {
          flex: 1; padding: 9px 16px;
          border: none; border-radius: 7px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.15s;
          background: transparent; color: var(--text-muted);
        }
        .ref-tab.active {
          background: var(--ocean-dark);
          color: #fff;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }
        .ref-tab:hover:not(.active) {
          background: rgba(255,255,255,0.05);
          color: var(--text);
        }
        .pr-item {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border);
          transition: background 0.14s;
        }
        .pr-item:last-child { border-bottom: none; }
        .pr-item:hover { background: rgba(255,255,255,0.02); }
        .pr-item-top {
          display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
        }
        .pr-user-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(96,165,250,0.2), rgba(251,191,36,0.15));
          border: 1px solid rgba(251,191,36,0.25);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 800;
          color: var(--sun); flex-shrink: 0;
        }
        .pr-challenge-info {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; margin-bottom: 10px;
          background: rgba(96,165,250,0.06);
          border: 1px solid rgba(96,165,250,0.12);
          border-radius: var(--radius-sm);
          font-size: 0.8rem; color: var(--text-muted);
        }
        .pr-points {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem; font-weight: 800;
          color: var(--success);
          text-shadow: 0 0 20px rgba(52,211,153,0.3);
          flex-shrink: 0;
        }
        .pr-note-input {
          width: 100%; padding: 8px 12px; margin-bottom: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text); font-size: 0.8rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          outline: none; transition: border-color 0.15s;
        }
        .pr-note-input:focus { border-color: var(--ocean-dark); }
        .pr-note-input::placeholder { color: var(--text-light); }
        .pr-actions { display: flex; gap: 8px; }
        .pr-btn-approve {
          flex: 1; padding: 9px; border: none; border-radius: var(--radius-sm);
          background: rgba(52,211,153,0.15); color: var(--success);
          border: 1px solid rgba(52,211,153,0.25);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          cursor: pointer; transition: all 0.15s;
        }
        .pr-btn-approve:hover:not(:disabled) {
          background: rgba(52,211,153,0.25);
          transform: translateY(-1px);
        }
        .pr-btn-reject {
          flex: 1; padding: 9px; border: none; border-radius: var(--radius-sm);
          background: rgba(248,113,113,0.12); color: var(--danger);
          border: 1px solid rgba(248,113,113,0.22);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          cursor: pointer; transition: all 0.15s;
        }
        .pr-btn-reject:hover:not(:disabled) {
          background: rgba(248,113,113,0.22);
          transform: translateY(-1px);
        }
        .pr-btn-approve:disabled, .pr-btn-reject:disabled {
          opacity: 0.4; cursor: not-allowed; transform: none;
        }
        .adm-alert-success {
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.25);
          color: var(--success);
        }
        .league-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; border-bottom: 1px solid var(--border);
          cursor: pointer; transition: background 0.14s;
        }
        .league-row:last-child { border-bottom: none; }
        .league-row:hover { background: rgba(96,165,250,0.07); }
        .league-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--sun); flex-shrink: 0;
          box-shadow: 0 0 6px rgba(251,191,36,0.5);
        }
      `}</style>

      <div className="adm-root">
        <div className="adm-content">

          <header className="adm-header">
            <div>
              <p className="adm-eyebrow">SummerSeason</p>
              <h1 className="adm-title">Referee Dashboard</h1>
            </div>
            <button className="adm-btn-primary" onClick={() => navigate("/challenges")}>
              🏁 Vai alle sfide
            </button>
          </header>

          {message && (
            <div className={`adm-alert ${message.type === "success" ? "adm-alert-success" : ""}`}>
              <span>{message.type === "error" ? "⚠️" : "✓"}</span> {message.text}
            </div>
          )}

          <div className="adm-stats">
            <div className="adm-stat-card">
              <div>
                <p className="adm-stat-label">Richieste in attesa</p>
                <p className="adm-stat-value" style={{ color: pending.length > 0 ? "var(--warning)" : "var(--ocean)" }}>
                  {pending.length}
                </p>
              </div>
              <div className="adm-stat-icon-wrap">⏳</div>
            </div>
            <div className="adm-stat-card">
              <div>
                <p className="adm-stat-label">Leghe seguite</p>
                <p className="adm-stat-value">{leagues.length}</p>
              </div>
              <div className="adm-stat-icon-wrap">🏆</div>
            </div>
          </div>

          <div className="adm-grid">

            <div className="adm-col">
              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-icon">⏳</div>
                  <h2 className="adm-card-title">Richieste punti</h2>
                  {pending.length > 0 && (
                    <span style={{
                      marginLeft: "auto", fontSize: "0.68rem", fontWeight: 700,
                      background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                      color: "var(--warning)", padding: "3px 10px", borderRadius: 20
                    }}>
                      {pending.length} in attesa
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="adm-empty">Caricamento...</div>
                ) : pending.length === 0 ? (
                  <div className="adm-empty" style={{ padding: "40px 0" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>✅</div>
                    <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Tutto in ordine!</p>
                    <p>Nessuna richiesta in attesa</p>
                  </div>
                ) : (
                  pending.map(r => (
                    <div key={r.id} className="pr-item">
                      <div className="pr-item-top">
                        <div className="pr-user-avatar">
                          {(r.user?.name ?? r.userName ?? "?")[0].toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text)" }}>
                            {r.user?.name ?? r.userName} {r.user?.surname ?? ""}
                          </div>
                          <div style={{ fontSize: "0.73rem", color: "var(--text-muted)", marginTop: 2 }}>
                            @{r.user?.userName ?? r.userName}
                          </div>
                        </div>
                        <div className="pr-points">+{r.pointsRequested ?? r.points} pts</div>
                      </div>

                      {(r.challengeName || r.challenge?.name) && (
                        <div className="pr-challenge-info">
                          <span>🏁</span>
                          <span style={{ fontWeight: 600, color: "var(--text)" }}>
                            {r.challengeName ?? r.challenge?.name}
                          </span>
                          {(r.leagueName || r.league?.name) && (
                            <>
                              <span style={{ opacity: 0.4 }}>·</span>
                              <span>🏆 {r.leagueName ?? r.league?.name}</span>
                            </>
                          )}
                        </div>
                      )}

                      {r.notes && (
                        <div style={{
                          padding: "8px 12px", marginBottom: 10,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.78rem", color: "var(--text-muted)",
                          fontStyle: "italic"
                        }}>
                          "{r.notes}"
                        </div>
                      )}

                      <input
                        className="pr-note-input"
                        placeholder="Aggiungi nota (opzionale)..."
                        value={note[r.id] || ""}
                        onChange={e => setNote(prev => ({ ...prev, [r.id]: e.target.value }))}
                      />

                      <div className="pr-actions">
                        <button className="pr-btn-approve" disabled={acting === r.id} onClick={() => approve(r.id)}>
                          {acting === r.id ? "⏳" : "✓ Approva"}
                        </button>
                        <button className="pr-btn-reject" disabled={acting === r.id} onClick={() => reject(r.id)}>
                          {acting === r.id ? "⏳" : "✕ Rifiuta"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="adm-col" style={{ gap: 20 }}>

              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-icon">🏆</div>
                  <h2 className="adm-card-title">Le tue leghe</h2>
                  <span style={{
                    marginLeft: "auto", fontSize: "0.68rem", fontWeight: 700,
                    background: "var(--ocean-light)", border: "1px solid var(--ocean-mid)",
                    color: "var(--ocean)", padding: "3px 10px", borderRadius: 20
                  }}>
                    {leagues.length}
                  </span>
                </div>

                {leagues.length === 0 ? (
                  <div className="adm-empty" style={{ padding: "32px 0" }}>
                    <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🏝️</div>
                    <p>Nessuna lega assegnata</p>
                  </div>
                ) : (
                  leagues.map(l => (
                    <div key={l.id ?? l.Id} className="league-row" onClick={() => navigate(`/league/${l.id ?? l.Id}`)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="league-dot" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)" }}>
                            {l.name ?? l.Name}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                            Creata il {new Date(l.creationDate ?? l.CreationDate).toLocaleDateString("it-IT")}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--ocean)", opacity: 0.7 }}>→</span>
                    </div>
                  ))
                )}
              </div>

              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-icon">⚖️</div>
                  <h2 className="adm-card-title">Il tuo ruolo</h2>
                </div>
                <div className="adm-card-body">
                  {[
                    { icon: "✓", label: "Approvare richieste punti", color: "var(--success)" },
                    { icon: "✕", label: "Rifiutare richieste punti", color: "var(--danger)" },
                    { icon: "👁️", label: "Visualizzare le leghe assegnate", color: "var(--ocean)" },
                    { icon: "📋", label: "Aggiungere note alle decisioni", color: "var(--text-muted)" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none"
                    }}>
                      <span style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", flexShrink: 0, color: item.color
                      }}>
                        {item.icon}
                      </span>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RefereePage;