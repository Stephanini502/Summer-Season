import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sharedStyles } from "../style/SharedStyles";

function UserDataPage() {
  const { id } = useParams();
  const userId = id || localStorage.getItem("userId");
  const token = localStorage.getItem("jwtToken");

  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [rankings, setRankings] = useState({});
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const normalizeDatas = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };

  const normalizeUserRanking = (u) => ({
    name: u.name || u.Name,
    surname: u.surname || u.Surname,
    userName: u.userName || u.UserName,
    totalPoints: u.totalPoints ?? u.TotalPoints ?? 0
  });

  const safeJson = async (response) => {
    if (!response.ok) throw new Error(`Errore API (${response.status})`);
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  };

  useEffect(() => {
    if (!userId) { setError("Utente non autenticato"); setLoading(false); return; }
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:5247/api/users/${userId}`, { headers }).then(safeJson),
      fetch(`http://localhost:5247/api/users/${userId}/roles`, { headers }).then(safeJson),
      fetch(`http://localhost:5247/api/leagues/user/${userId}`, { headers }).then(safeJson),
      fetch(`http://localhost:5247/api/results/weeklyResults/${userId}`, { headers }).then(safeJson),
    ])
      .then(async ([userData, rolesData, leaguesData, weeklyData]) => {
        const normalizedLeagues = normalizeDatas(leaguesData);
        setUser(userData);
        setRoles(normalizeDatas(rolesData));
        setLeagues(normalizedLeagues);
        setWeeklyPoints(weeklyData ?? 0);
        const rankingMap = {};
        if (normalizedLeagues.length > 0) {
          await Promise.all(normalizedLeagues.map(async (league) => {
            const res = await fetch(`http://localhost:5247/api/leagues/${league.id}/ranking`, { headers });
            const data = await res.json();
            rankingMap[league.id] = normalizeDatas(data).map(normalizeUserRanking);
          }));
        }
        setRankings(rankingMap);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const getUserPosition = (leagueId) => {
    const ranking = rankings[leagueId] || [];
    const index = ranking.findIndex(u =>
      (u.userName || "").toLowerCase() === (user?.userName || "").toLowerCase()
    );
    return index >= 0 ? index + 1 : null;
  };

  const positionLabel = (pos) => {
    if (!pos) return null;
    if (pos === 1) return { emoji: "🥇", badge: "pg-badge-sun" };
    if (pos === 2) return { emoji: "🥈", badge: "pg-badge-blue" };
    if (pos === 3) return { emoji: "🥉", badge: "pg-badge-blue" };
    return { emoji: "", badge: "pg-badge-blue" };
  };

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

  if (!user) return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root"><div className="pg-empty">Utente non trovato</div></div>
    </>
  );

  const initials = `${(user.name || "?")[0]}${(user.surname || "?")[0]}`.toUpperCase();

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root">
        <div className="pg-content">

          <header className="pg-header">
            <div>
              <p className="pg-eyebrow">SummerSeason Platform</p>
              <h1 className="pg-title">Profilo Utente</h1>
            </div>
            <button className="pg-btn pg-btn-primary" onClick={() => navigate("/challenges")}>
              🏁 Vai alle sfide
            </button>
          </header>

          <div className="pg-grid-sidebar" style={{ alignItems: "start" }}>

            <div className="pg-col" style={{ gap: 20 }}>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">👤</div>
                    <h2 className="pg-card-title">Profilo</h2>
                  </div>
                </div>
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <div className="pg-avatar">{initials}</div>
                  <h3 style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: 4 }}>
                    {user.name} {user.surname}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 14 }}>
                    {user.userName}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                    {roles.map((r, i) => (
                      <span key={i} className="pg-badge pg-badge-blue">{r}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">📊</div>
                    <h2 className="pg-card-title">Statistiche</h2>
                  </div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <div className="pg-info-row">
                    <span className="pg-info-row-label">Leghe</span>
                    <span className="pg-info-row-value" style={{ color: "var(--ocean)", fontSize: "1.3rem", fontWeight: 800 }}>
                      {leagues.length}
                    </span>
                  </div>
                  <div className="pg-info-row">
                    <span className="pg-info-row-label">Punti questa settimana</span>
                    <span className="pg-info-row-value" style={{ color: "var(--success)", fontSize: "1.3rem", fontWeight: 800 }}>
                      {weeklyPoints}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pg-col" style={{ gap: 0 }}>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">🏆</div>
                    <h2 className="pg-card-title">Le mie leghe</h2>
                  </div>
                  {leagues.length > 0 && (
                    <span className="pg-badge pg-badge-sun">{leagues.length} leghe</span>
                  )}
                </div>

                {leagues.length === 0 ? (
                  <div className="pg-empty" style={{ padding: "48px 0" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 10 }}>🏝️</div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Non sei ancora in nessuna lega</p>
                    <p>Chiedi a un admin di aggiungerti</p>
                  </div>
                ) : (
                  <div>
                    {leagues.map((league, leagueIdx) => {
                      const pos = getUserPosition(league.id);
                      const label = positionLabel(pos);
                      const ranking = rankings[league.id] || [];

                      return (
                        <div key={league.id} style={{
                          borderBottom: leagueIdx < leagues.length - 1
                            ? "1px solid var(--border)" : "none"
                        }}>
                          <div
                            onClick={() => navigate(`/league/${league.id}`)}
                            style={{
                              display: "flex", alignItems: "center",
                              justifyContent: "space-between",
                              padding: "14px 24px",
                              cursor: "pointer",
                              background: "linear-gradient(to right, #fafbff, #fffdf5)",
                              transition: "background 0.15s",
                              gap: 12
                            }}
                            onMouseOver={e => e.currentTarget.style.background = "var(--ocean-light)"}
                            onMouseOut={e => e.currentTarget.style.background = "linear-gradient(to right, #fafbff, #fffdf5)"}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              {pos ? (
                                <span className={`pg-badge ${label.badge}`} style={{
                                  fontSize: "0.75rem", padding: "5px 12px",
                                  fontWeight: 800, flexShrink: 0
                                }}>
                                  {label.emoji} #{pos}
                                </span>
                              ) : (
                                <span style={{
                                  width: 36, height: 28, borderRadius: 20,
                                  background: "var(--border)", display: "inline-block", flexShrink: 0
                                }} />
                              )}
                              <div>
                                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>
                                  {league.name}
                                </div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 1 }}>
                                  Creata il {new Date(league.creationDate).toLocaleDateString("it-IT")}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                              {ranking.length > 0 && (() => {
                                const me = ranking.find(u =>
                                  (u.userName || "").toLowerCase() === (user.userName || "").toLowerCase()
                                );
                                return me ? (
                                  <span className="pg-badge pg-badge-green">
                                    {me.totalPoints} pts
                                  </span>
                                ) : null;
                              })()}
                              <span style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>→</span>
                            </div>
                          </div>

                          {ranking.length > 0 && (
                            <div style={{
                              padding: "0 24px 14px",
                              display: "flex", gap: 8, flexWrap: "wrap"
                            }}>
                              {ranking.slice(0, 3).map((u, idx) => {
                                const isMe = (u.userName || "").toLowerCase() === (user.userName || "").toLowerCase();
                                const medals = ["🥇", "🥈", "🥉"];
                                return (
                                  <div key={idx} style={{
                                    display: "flex", alignItems: "center", gap: 6,
                                    padding: "5px 12px",
                                    background: isMe ? "var(--sun-light)" : "var(--bg)",
                                    border: `1px solid ${isMe ? "var(--sun-mid)" : "var(--border)"}`,
                                    borderRadius: 20,
                                    fontSize: "0.74rem",
                                    fontWeight: isMe ? 700 : 500,
                                    color: "var(--text)"
                                  }}>
                                    <span>{medals[idx]}</span>
                                    <span>{u.name} {u.surname}</span>
                                    <span style={{
                                      color: "var(--text-muted)", fontSize: "0.68rem"
                                    }}>
                                      {u.totalPoints} pts
                                    </span>
                                  </div>
                                );
                              })}
                              {ranking.length > 3 && (
                                <div style={{
                                  display: "flex", alignItems: "center",
                                  padding: "5px 12px",
                                  background: "var(--bg)", border: "1px solid var(--border)",
                                  borderRadius: 20, fontSize: "0.72rem", color: "var(--text-muted)"
                                }}>
                                  +{ranking.length - 3} altri
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDataPage;