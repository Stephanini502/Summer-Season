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
    const index = ranking.findIndex(u => (u.userName || "").toLowerCase() === user.userName.toLowerCase());
    return index >= 0 ? index + 1 : null;
  };

  const positionBadgeClass = (pos) => {
    if (!pos) return null;
    if (pos === 1) return "pg-badge pg-badge-yellow";
    if (pos <= 3) return "pg-badge pg-badge-blue";
    return "pg-badge pg-badge-blue";
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

            {/* SIDEBAR */}
            <div className="pg-col" style={{ gap: 20 }}>

              {/* PROFILO */}
              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">👤</div>
                    <h2 className="pg-card-title">Profilo</h2>
                  </div>
                </div>
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <div className="pg-avatar">{initials}</div>
                  <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: 4 }}>
                    {user.name} {user.surname}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 14 }}>{user.userName}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                    {roles.map((r, i) => (
                      <span key={i} className="pg-badge pg-badge-blue">{r}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* STATISTICHE */}
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
                    <span className="pg-info-row-value" style={{ color: "var(--blue-primary)", fontSize: "1.3rem", fontWeight: 800 }}>
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

            {/* MAIN */}
            <div className="pg-col" style={{ gap: 20 }}>

              {/* LE MIE LEGHE */}
              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">🏆</div>
                    <h2 className="pg-card-title">Le mie leghe</h2>
                  </div>
                </div>
                <div className="pg-table-wrap">
                  <table className="pg-table">
                    <thead>
                      <tr><th>Nome lega</th><th>Data creazione</th></tr>
                    </thead>
                    <tbody>
                      {leagues.length > 0 ? leagues.map(l => (
                        <tr key={l.id} className="clickable" onClick={() => navigate(`/league/${l.id}`)}>
                          <td className="bold">{l.name}</td>
                          <td className="muted">{new Date(l.creationDate).toLocaleDateString("it-IT")}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan="2"><div className="pg-empty">Nessuna lega</div></td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CLASSIFICHE */}
              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left">
                    <div className="pg-card-icon">🥇</div>
                    <h2 className="pg-card-title">Posizione nelle classifiche</h2>
                  </div>
                </div>
                <div className="pg-table-wrap">
                  <table className="pg-table">
                    <thead>
                      <tr><th>Lega</th><th>Posizione</th></tr>
                    </thead>
                    <tbody>
                      {leagues.length > 0 ? leagues.map(league => {
                        const pos = getUserPosition(league.id);
                        return (
                          <tr key={league.id}>
                            <td className="bold">{league.name}</td>
                            <td>
                              {pos
                                ? <span className={positionBadgeClass(pos)}>{pos === 1 ? "🥇 " : pos === 2 ? "🥈 " : pos === 3 ? "🥉 " : ""}#{pos}</span>
                                : <span style={{ color: "var(--text-light)" }}>—</span>
                              }
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr><td colSpan="2"><div className="pg-empty">Nessuna lega</div></td></tr>
                      )}
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

export default UserDataPage;