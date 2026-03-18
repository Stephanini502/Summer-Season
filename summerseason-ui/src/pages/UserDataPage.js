import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sharedStyles } from "../style/SharedStyles";

const userPageStyles = `
  /* Avatar upload area */
  .avatar-wrap {
    position: relative;
    width: 80px; height: 80px;
    margin: 0 auto 14px;
    cursor: pointer;
  }

  .avatar-img {
    width: 80px; height: 80px; border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(251,191,36,0.35);
    box-shadow: 0 0 20px rgba(96,165,250,0.12);
    display: block;
  }

  .avatar-initials {
    width: 80px; height: 80px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(96,165,250,0.2), rgba(251,191,36,0.15));
    border: 2px solid rgba(251,191,36,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif;
    font-size: 1.8rem; font-weight: 800; color: #60a5fa;
    box-shadow: 0 0 20px rgba(96,165,250,0.1);
  }

  .avatar-overlay {
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(0,0,0,0);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
    border-radius: 50%;
  }
  .avatar-wrap:hover .avatar-overlay { background: rgba(0,0,0,0.52); }

  .avatar-edit-icon {
    opacity: 0; transition: opacity 0.2s;
    font-size: 1.2rem;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
  }
  .avatar-wrap:hover .avatar-edit-icon { opacity: 1; }

  .avatar-upload-hint {
    font-size: 0.68rem; color: #4b5675; margin-top: -6px; margin-bottom: 10px;
    transition: color 0.15s;
  }
  .avatar-wrap:hover + .avatar-upload-hint { color: #60a5fa; }

  /* Upload spinner */
  .avatar-uploading {
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(13,17,23,0.7);
    display: flex; align-items: center; justify-content: center;
  }
  .avatar-spinner {
    width: 22px; height: 22px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.1);
    border-top-color: #fbbf24;
    animation: pgSpin 0.6s linear infinite;
  }

  /* Toast notifica */
  .avatar-toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    background: #1a2236; border: 1px solid rgba(52,211,153,0.3);
    color: #34d399; font-size: 0.82rem; font-weight: 600;
    padding: 10px 20px; border-radius: 20px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    z-index: 300;
    animation: toastIn 0.25s ease both;
  }
  @keyframes toastIn {
    from { opacity:0; transform: translateX(-50%) translateY(12px); }
    to   { opacity:1; transform: translateX(-50%) translateY(0); }
  }
  .avatar-toast-error {
    border-color: rgba(248,113,113,0.3);
    color: #f87171;
  }
`;

function UserDataPage() {
  const { id } = useParams();
  const userId = id || localStorage.getItem("userId");
  const myId   = localStorage.getItem("userId");
  const isOwnProfile = !id || id === myId;

  const token = localStorage.getItem("jwtToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [user, setUser]           = useState(null);
  const [roles, setRoles]         = useState([]);
  const [leagues, setLeagues]     = useState([]);
  const [rankings, setRankings]   = useState({});
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast]         = useState(null); // { msg, error }

  const fileInputRef = useRef();
  const navigate = useNavigate();

  /* ── helpers ── */
  const normalizeDatas = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };
  const normalizeUserRanking = (u) => ({
    name: u.name || u.Name, surname: u.surname || u.Surname,
    userName: u.userName || u.UserName, totalPoints: u.totalPoints ?? u.TotalPoints ?? 0
  });
  const safeJson = async (res) => {
    if (!res.ok) throw new Error(`Errore API (${res.status})`);
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  };

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
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
        setAvatarUrl(userData?.avatarUrl ?? userData?.AvatarUrl ?? null);
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

  const handleAvatarClick = () => {
    if (!isOwnProfile) return;
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      showToast("Formato non supportato. Usa JPG, PNG o WebP.", true);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("Immagine troppo grande (max 10MB).", true);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `http://localhost:5247/api/media/user/${userId}/avatar`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }
      );
      if (!res.ok) throw new Error(await res.text() || "Errore upload");
      const { url } = await res.json();
      setAvatarUrl(url);
      showToast("✓ Foto profilo aggiornata!");
    } catch (err) {
      showToast("Errore: " + err.message, true);
    } finally {
      setUploading(false);
    }
  };

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
    <><style>{sharedStyles}{userPageStyles}</style>
      <div className="pg-root"><div className="pg-loading"><div className="pg-spinner"/></div></div>
    </>
  );
  if (error) return (
    <><style>{sharedStyles}{userPageStyles}</style>
      <div className="pg-root"><div className="pg-alert pg-alert-danger">⚠️ {error}</div></div>
    </>
  );
  if (!user) return (
    <><style>{sharedStyles}{userPageStyles}</style>
      <div className="pg-root"><div className="pg-empty">Utente non trovato</div></div>
    </>
  );

  const initials = `${(user.name || "?")[0]}${(user.surname || "?")[0]}`.toUpperCase();

  return (
    <>
      <style>{sharedStyles}{userPageStyles}</style>

      {toast && (
        <div className={`avatar-toast ${toast.isError ? "avatar-toast-error" : ""}`}>
          {toast.msg}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={handleAvatarChange}
      />

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

                  <div
                    className="avatar-wrap"
                    onClick={handleAvatarClick}
                    title={isOwnProfile ? "Clicca per cambiare foto" : ""}
                    style={{ cursor: isOwnProfile ? "pointer" : "default" }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="avatar-img" />
                    ) : (
                      <div className="avatar-initials">{initials}</div>
                    )}

                    {isOwnProfile && !uploading && (
                      <div className="avatar-overlay">
                        <span className="avatar-edit-icon">📷</span>
                      </div>
                    )}

                    {uploading && (
                      <div className="avatar-uploading">
                        <div className="avatar-spinner" />
                      </div>
                    )}
                  </div>

                  {isOwnProfile && (
                    <p className="avatar-upload-hint">
                      {uploading ? "Caricamento..." : "Clicca per cambiare foto"}
                    </p>
                  )}

                  <h3 style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: 4, color: "var(--text)" }}>
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
                      const pos     = getUserPosition(league.id);
                      const label   = positionLabel(pos);
                      const ranking = rankings[league.id] || [];
                      return (
                        <div key={league.id} style={{
                          borderBottom: leagueIdx < leagues.length - 1 ? "1px solid var(--border)" : "none"
                        }}>
                          <div
                            onClick={() => navigate(`/league/${league.id}`)}
                            style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 24px", cursor:"pointer", background:"rgba(255,255,255,0.02)", transition:"background 0.15s", gap:12 }}
                            onMouseOver={e => e.currentTarget.style.background = "rgba(96,165,250,0.07)"}
                            onMouseOut={e  => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                          >
                            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                              {pos ? (
                                <span className={`pg-badge ${label.badge}`} style={{ fontSize:"0.75rem", padding:"5px 12px", fontWeight:800, flexShrink:0 }}>
                                  {label.emoji} #{pos}
                                </span>
                              ) : (
                                <span style={{ width:36, height:28, borderRadius:20, background:"rgba(255,255,255,0.06)", display:"inline-block", flexShrink:0 }}/>
                              )}
                              <div>
                                <div style={{ fontWeight:700, fontSize:"0.9rem", color:"var(--text)" }}>{league.name}</div>
                                <div style={{ fontSize:"0.72rem", color:"var(--text-muted)", marginTop:1 }}>
                                  Creata il {new Date(league.creationDate).toLocaleDateString("it-IT")}
                                </div>
                              </div>
                            </div>
                            <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                              {ranking.length > 0 && (() => {
                                const me = ranking.find(u => (u.userName||"").toLowerCase() === (user.userName||"").toLowerCase());
                                return me ? <span className="pg-badge pg-badge-green">{me.totalPoints} pts</span> : null;
                              })()}
                              <span style={{ color:"var(--text-light)", fontSize:"0.8rem" }}>→</span>
                            </div>
                          </div>

                          {ranking.length > 0 && (
                            <div style={{ padding:"0 24px 14px", display:"flex", gap:8, flexWrap:"wrap" }}>
                              {ranking.slice(0, 3).map((u, idx) => {
                                const isMe   = (u.userName||"").toLowerCase() === (user.userName||"").toLowerCase();
                                const medals = ["🥇","🥈","🥉"];
                                return (
                                  <div key={idx} style={{
                                    display:"flex", alignItems:"center", gap:6,
                                    padding:"5px 12px",
                                    background: isMe ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.03)",
                                    border: `1px solid ${isMe ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.07)"}`,
                                    borderRadius:20, fontSize:"0.74rem",
                                    fontWeight: isMe ? 700 : 500, color:"var(--text)"
                                  }}>
                                    <span>{medals[idx]}</span>
                                    <span>{u.name} {u.surname}</span>
                                    <span style={{ color:"var(--text-muted)", fontSize:"0.68rem" }}>{u.totalPoints} pts</span>
                                  </div>
                                );
                              })}
                              {ranking.length > 3 && (
                                <div style={{ display:"flex", alignItems:"center", padding:"5px 12px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, fontSize:"0.72rem", color:"var(--text-muted)" }}>
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