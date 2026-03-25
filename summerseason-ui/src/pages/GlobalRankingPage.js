import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sharedStyles } from "../style/SharedStyles";

function GlobalRankingPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const myId    = localStorage.getItem("userId");
  const token   = localStorage.getItem("jwtToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const normalizeDatas = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch("http://localhost:5247/api/users", { headers });
        const data = await res.json();
        const sorted = normalizeDatas(data)
            .map(u => ({
                id:          u.id ?? u.Id,
                name:        u.name ?? u.Name ?? "",
                surname:     u.surname ?? u.Surname ?? "",
                userName:    u.userName ?? u.UserName ?? "",
                totalPoints: parseInt(u.totalPoints ?? u.TotalPoints ?? 0),
                avatarUrl:   u.avatarUrl ?? u.AvatarUrl ?? null,
                roles:       (() => {
                let r = u.roles ?? u.Roles ?? [];
                if (r && r.$values) r = r.$values;
                return Array.isArray(r) ? r : [];
                })()
            }))
            .filter(u => {
                return u.roles.includes(3);
            })
            .sort((a, b) => b.totalPoints - a.totalPoints);
        setRanking(sorted);
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const rankClass = (i) => i===0?"pg-rank pg-rank-1":i===1?"pg-rank pg-rank-2":i===2?"pg-rank pg-rank-3":"pg-rank";

  const myPosition = ranking.findIndex(u => u.id === parseInt(myId)) + 1;

  if (loading) return (<><style>{sharedStyles}</style><div className="pg-root"><div className="pg-loading"><div className="pg-spinner"/></div></div></>);

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root">
        <div className="pg-content">

          <header className="pg-header">
            <div>
              <p className="pg-eyebrow">SummerSeason</p>
              <h1 className="pg-title">Classifica globale</h1>
            </div>
          </header>

          <div className="pg-stats">
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Partecipanti totali</p><p className="pg-stat-value">{ranking.length}</p></div>
              <div className="pg-stat-icon">👥</div>
            </div>
            {myPosition > 0 && (
              <div className="pg-stat-card">
                <div><p className="pg-stat-label">La tua posizione</p><p className="pg-stat-value" style={{ color: myPosition <= 3 ? "var(--sun)" : "var(--ocean)" }}>#{myPosition}</p></div>
                <div className="pg-stat-icon pg-stat-icon-yellow">
                  {myPosition === 1 ? "🥇" : myPosition === 2 ? "🥈" : myPosition === 3 ? "🥉" : "🏅"}
                </div>
              </div>
            )}
            {ranking[0] && (
              <div className="pg-stat-card">
                <div><p className="pg-stat-label">Leader</p><p className="pg-stat-value-sm">{ranking[0].name} {ranking[0].surname}</p><p className="pg-stat-sub">{ranking[0].totalPoints} pts</p></div>
                <div className="pg-stat-icon pg-stat-icon-yellow">🥇</div>
              </div>
            )}
          </div>

          <div className="pg-card" style={{ marginBottom: 0 }}>
            <div className="pg-card-header">
              <div className="pg-card-header-left">
                <div className="pg-card-icon">🌍</div>
                <h2 className="pg-card-title">Tutti i giocatori</h2>
              </div>
              <span className="pg-badge pg-badge-blue">{ranking.length} utenti</span>
            </div>
            <ul className="pg-list">
              {ranking.map((u, idx) => {
                const isMe = u.id === parseInt(myId);
                return (
                  <li
                    key={u.id}
                    className="pg-list-item clickable"
                    onClick={() => navigate(`/user/${u.id}`)}
                    style={isMe ? { background:"rgba(251,191,36,0.06)", borderLeft:"3px solid rgba(251,191,36,0.4)" } : {}}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span className={rankClass(idx)}>{idx+1}</span>

                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover", border:"2px solid rgba(251,191,36,0.2)", flexShrink:0 }}/>
                      ) : (
                        <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg, rgba(96,165,250,0.2), rgba(251,191,36,0.15))", border:"1px solid rgba(251,191,36,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.82rem", color:"#fbbf24", flexShrink:0 }}>
                          {(u.name[0] ?? "?").toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="pg-list-item-name">
                          {u.name} {u.surname}
                          {isMe && (
                            <span style={{ marginLeft:8, fontSize:"0.68rem", fontWeight:700, color:"var(--sun)", background:"rgba(251,191,36,0.12)", border:"1px solid rgba(251,191,36,0.25)", padding:"2px 7px", borderRadius:20 }}>
                              Tu
                            </span>
                          )}
                        </div>
                        <div className="pg-list-item-sub">@{u.userName}</div>
                      </div>
                    </div>

                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      {idx === 0 && <span style={{ fontSize:"1.1rem" }}>🥇</span>}
                      {idx === 1 && <span style={{ fontSize:"1.1rem" }}>🥈</span>}
                      {idx === 2 && <span style={{ fontSize:"1.1rem" }}>🥉</span>}
                      <span className="pg-badge pg-badge-blue">{u.totalPoints} pts</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}

export default GlobalRankingPage;