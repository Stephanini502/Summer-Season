import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminStyles } from "../style/SharedStyles";

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

function RefereeProposalsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const adminId = parseInt(localStorage.getItem("userId"));
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [notifications, setNotifications] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("unread");

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const [notifRes, challengeRes] = await Promise.all([
        fetch(`http://localhost:5247/api/notifications/user/${adminId}`, { headers }),
        fetch(`http://localhost:5247/api/challenges`, { headers })
      ]);

      if (notifRes.ok) {
        const data = await notifRes.json();
        const list = Array.isArray(data) ? data : data.$values ?? [];
        setNotifications(list.filter(n => (n.type ?? n.Type) === "ChallengeProposal"));
      }

      if (challengeRes.ok) {
        const data = await challengeRes.json();
        const list = Array.isArray(data) ? data : data.$values ?? [];
        setChallenges(list);
      }

    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { loadNotifications(); }, []);

  const markRead = async (id) => {
    try {
      await fetch(`http://localhost:5247/api/notifications/${id}/read`, { method: "PUT", headers });
      setNotifications(prev => prev.map(n =>
        (n.id ?? n.Id) === id ? { ...n, isRead: true, IsRead: true } : n
      ));
    } catch { }
  };

  const markAllRead = async () => {
    try {
      await fetch(`http://localhost:5247/api/notifications/user/${adminId}/read-all`, { method: "PUT", headers });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, IsRead: true })));
    } catch { }
  };

  const filtered = filter === "unread"
    ? notifications.filter(n => !(n.isRead ?? n.IsRead))
    : notifications;

  const unreadCount = notifications.filter(n => !(n.isRead ?? n.IsRead)).length;

  const findChallenge = (name) =>
    challenges.find(c => (c.name ?? c.Name ?? "").toLowerCase() === name?.toLowerCase());

  const isChanged = (current, proposed) =>
    current !== undefined && proposed !== undefined &&
    current.toString().trim() !== proposed.toString().trim();

  return (
    <>
      <style>{adminStyles}{`
        .notif-item {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          transition: background 0.14s;
        }
        .notif-item:last-child { border-bottom: none; }
        .notif-item:hover { background: rgba(255,255,255,0.02); }
        .notif-item.read { opacity: 0.55; }
        .notif-icon {
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 1rem;
        }
        .notif-field {
          padding: 10px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }
        .notif-field.changed-current {
          background: rgba(248,113,113,0.06);
          border-color: rgba(248,113,113,0.2);
        }
        .notif-field.changed-proposed {
          background: rgba(52,211,153,0.06);
          border-color: rgba(52,211,153,0.2);
        }
        .notif-field-label {
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;
        }
        .notif-field-value {
          font-size: 0.82rem; font-weight: 600; color: var(--text);
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
        .filter-tabs {
          display: flex; gap: 4px; padding: 4px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }
        .filter-tab {
          padding: 7px 16px; border: none; border-radius: 6px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.78rem; font-weight: 600;
          cursor: pointer; transition: all 0.15s;
          background: transparent; color: var(--text-muted);
        }
        .filter-tab.active {
          background: var(--ocean-dark); color: #fff;
          box-shadow: 0 2px 8px rgba(59,130,246,0.3);
        }
        .filter-tab:hover:not(.active) {
          background: rgba(255,255,255,0.05); color: var(--text);
        }
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr 32px 1fr;
          gap: 8px;
          align-items: center;
          margin-bottom: 12px;
        }
        .compare-arrow {
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; color: var(--text-muted);
        }
        .compare-col-label {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .compare-section {
          margin-bottom: 16px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
        }
        .compare-row {
          display: grid;
          grid-template-columns: 100px 1fr 32px 1fr;
          gap: 8px;
          align-items: start;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .compare-row:last-child { border-bottom: none; }
        .compare-row-label {
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--text-muted);
          padding-top: 2px;
        }
        .compare-cell {
          font-size: 0.82rem; color: var(--text); line-height: 1.4;
          padding: 4px 8px; border-radius: 6px;
        }
        .compare-cell.old {
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.15);
          color: var(--danger);
          text-decoration: line-through;
          opacity: 0.8;
        }
        .compare-cell.new {
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.15);
          color: var(--success);
          font-weight: 600;
        }
        .compare-cell.unchanged {
          color: var(--text-muted);
          font-style: italic;
        }
        .unchanged-badge {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          color: var(--text-muted);
          padding: 2px 7px; border-radius: 20px;
        }
        .changed-badge {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.25);
          color: var(--warning);
          padding: 2px 7px; border-radius: 20px;
        }
      `}</style>

      <div className="adm-root">
        <div className="adm-content">

          <header className="adm-header">
            <div>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: "none", border: "none", color: "var(--text-muted)",
                  fontSize: "0.78rem", cursor: "pointer", marginBottom: 6,
                  fontFamily: "'Plus Jakarta Sans', sans-serif", padding: 0,
                  display: "flex", alignItems: "center", gap: 4
                }}
              >
                ← Torna alla dashboard
              </button>
              <p className="adm-eyebrow">SummerSeason Platform</p>
              <h1 className="adm-title">Proposte degli arbitri</h1>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="adm-btn-primary"
                style={{ background: "rgba(52,211,153,0.15)", color: "var(--success)", border: "1px solid rgba(52,211,153,0.25)", boxShadow: "none" }}
              >
                ✓ Segna tutte lette
              </button>
            )}
          </header>

          <div className="adm-stats">
            <div className="adm-stat-card">
              <div><p className="adm-stat-label">Proposte totali</p><p className="adm-stat-value">{notifications.length}</p></div>
              <div className="adm-stat-icon-wrap">📋</div>
            </div>
            <div className="adm-stat-card">
              <div>
                <p className="adm-stat-label">Non lette</p>
                <p className="adm-stat-value" style={{ color: unreadCount > 0 ? "var(--warning)" : "var(--ocean)" }}>{unreadCount}</p>
              </div>
              <div className="adm-stat-icon-wrap">🔔</div>
            </div>
          </div>

          <div className="adm-card">
            <div className="adm-card-header" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="adm-card-icon" style={{ background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.3)" }}>⚖️</div>
                <h2 className="adm-card-title">Tutte le proposte</h2>
              </div>
              <div className="filter-tabs">
                <button className={`filter-tab ${filter === "unread" ? "active" : ""}`} onClick={() => setFilter("unread")}>
                  Non lette {unreadCount > 0 && `(${unreadCount})`}
                </button>
                <button className={`filter-tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
                  Tutte ({notifications.length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="adm-empty">Caricamento...</div>
            ) : filtered.length === 0 ? (
              <div className="adm-empty" style={{ padding: "48px 0" }}>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>{filter === "unread" ? "✅" : "📭"}</div>
                <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                  {filter === "unread" ? "Tutto in ordine!" : "Nessuna proposta"}
                </p>
                <p>{filter === "unread" ? "Nessuna proposta non letta" : "Gli arbitri non hanno ancora inviato proposte"}</p>
              </div>
            ) : (
              filtered.map(n => {
                const p = parseProposal(n.message ?? n.Message ?? "");
                const isRead = n.isRead ?? n.IsRead;
                const current = findChallenge(p?.challenge);

                const currentName = current?.name ?? current?.Name ?? "—";
                const currentDesc = current?.description ?? current?.Description ?? "—";
                const currentPts = current?.points ?? current?.Points;

                const nameChanged = isChanged(currentName, p?.name);
                const descChanged = isChanged(currentDesc, p?.description);
                const ptsChanged = isChanged(currentPts?.toString(), p?.points);

                const changesCount = [nameChanged, descChanged, ptsChanged].filter(Boolean).length;

                return (
                  <div key={n.id ?? n.Id} className={`notif-item ${isRead ? "read" : ""}`}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div className="notif-icon">⚖️</div>
                      <div style={{ flex: 1, minWidth: 0 }}>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text)" }}>
                              {p?.referee ?? "Arbitro"}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>propone modifica a</span>
                            <span style={{
                              fontSize: "0.72rem", fontWeight: 700,
                              background: "var(--ocean-light)", border: "1px solid var(--ocean-mid)",
                              color: "var(--ocean)", padding: "2px 8px", borderRadius: 20
                            }}>
                              🏁 {p?.challenge ?? "—"}
                            </span>
                            {changesCount > 0
                              ? <span className="changed-badge">{changesCount} modifica{changesCount > 1 ? "he" : ""}</span>
                              : <span className="unchanged-badge">nessuna modifica</span>
                            }
                            {!isRead && (
                              <span style={{
                                fontSize: "0.62rem", fontWeight: 700,
                                background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)",
                                color: "var(--warning)", padding: "2px 8px", borderRadius: 20
                              }}>NUOVA</span>
                            )}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0 }}>
                            {new Date(n.createdAt ?? n.CreatedAt).toLocaleDateString("it-IT", {
                              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                            })}
                          </div>
                        </div>

                        {current && (
                          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 32px 1fr", gap: 8, marginBottom: 6 }}>
                            <div />
                            <div className="compare-col-label" style={{ color: "var(--danger)" }}>
                              <span>🔴</span> Attuale
                            </div>
                            <div />
                            <div className="compare-col-label" style={{ color: "var(--success)" }}>
                              <span>🟢</span> Proposta
                            </div>
                          </div>
                        )}

                        <div className="compare-section">

                          <div className="compare-row">
                            <div className="compare-row-label">Nome</div>
                            {current ? (
                              <>
                                <div className={`compare-cell ${nameChanged ? "old" : "unchanged"}`}>
                                  {currentName}
                                </div>
                                <div className="compare-arrow">→</div>
                                <div className={`compare-cell ${nameChanged ? "new" : "unchanged"}`}>
                                  {p?.name ?? "—"}
                                  {!nameChanged && <span style={{ marginLeft: 6, fontSize: "0.7rem", opacity: 0.6 }}>(invariato)</span>}
                                </div>
                              </>
                            ) : (
                              <div className="compare-cell new" style={{ gridColumn: "2 / 5" }}>
                                {p?.name ?? "—"}
                              </div>
                            )}
                          </div>

                          <div className="compare-row">
                            <div className="compare-row-label">Punti</div>
                            {current ? (
                              <>
                                <div className={`compare-cell ${ptsChanged ? "old" : "unchanged"}`}>
                                  +{currentPts} pts
                                </div>
                                <div className="compare-arrow">→</div>
                                <div className={`compare-cell ${ptsChanged ? "new" : "unchanged"}`}>
                                  +{p?.points} pts
                                  {!ptsChanged && <span style={{ marginLeft: 6, fontSize: "0.7rem", opacity: 0.6 }}>(invariato)</span>}
                                </div>
                              </>
                            ) : (
                              <div className="compare-cell new" style={{ gridColumn: "2 / 5" }}>
                                +{p?.points} pts
                              </div>
                            )}
                          </div>

                          <div className="compare-row">
                            <div className="compare-row-label">Descrizione</div>
                            {current ? (
                              <>
                                <div className={`compare-cell ${descChanged ? "old" : "unchanged"}`} style={{ lineHeight: 1.5 }}>
                                  {currentDesc}
                                </div>
                                <div className="compare-arrow">→</div>
                                <div className={`compare-cell ${descChanged ? "new" : "unchanged"}`} style={{ lineHeight: 1.5 }}>
                                  {p?.description ?? "—"}
                                  {!descChanged && <span style={{ marginLeft: 6, fontSize: "0.7rem", opacity: 0.6 }}>(invariata)</span>}
                                </div>
                              </>
                            ) : (
                              <div className="compare-cell new" style={{ gridColumn: "2 / 5", lineHeight: 1.5 }}>
                                {p?.description ?? "—"}
                              </div>
                            )}
                          </div>

                        </div>

                        {!isRead && (
                          <button className="notif-read-btn" onClick={() => markRead(n.id ?? n.Id)}>
                            ✓ Segna come letta
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default RefereeProposalsPage;