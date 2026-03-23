import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sharedStyles } from "../style/SharedStyles";
import { userPageStyles } from "../style/SharedStyles";

function UserDataPage() {
  const { id } = useParams();
  const userId = id || localStorage.getItem("userId");
  const myId   = localStorage.getItem("userId");
  const isOwnProfile = !id || id === myId;

  const token = localStorage.getItem("jwtToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const [user, setUser]                 = useState(null);
  const [roles, setRoles]               = useState([]);
  const [leagues, setLeagues]           = useState([]);
  const [rankings, setRankings]         = useState({});
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [globalRanking, setGlobalRanking] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [avatarUrl, setAvatarUrl]       = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [toast, setToast]               = useState(null);

  const [showCreateLeague, setShowCreateLeague] = useState(false);
  const [leagueName, setLeagueName]             = useState("");
  const [searchQuery, setSearchQuery]           = useState("");
  const [searchResults, setSearchResults]       = useState([]);
  const [selectedUsers, setSelectedUsers]       = useState([]);
  const [creatingLeague, setCreatingLeague]     = useState(false);
  const [showDropdown, setShowDropdown]         = useState(false);

  const fileInputRef = useRef();
  const searchRef    = useRef();
  const dropdownRef  = useRef();
  const navigate     = useNavigate();

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
    totalPoints: parseInt(u.totalPoints ?? u.TotalPoints ?? 0)
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
      fetch(`http://localhost:5247/api/users`, { headers }).then(safeJson),
    ])
      .then(async ([userData, rolesData, leaguesData, weeklyData, allUsersData]) => {
        const normalizedLeagues = normalizeDatas(leaguesData);
        setUser(userData);
        setAvatarUrl(userData?.avatarUrl ?? userData?.AvatarUrl ?? null);
        setRoles(normalizeDatas(rolesData));
        setLeagues(normalizedLeagues);
        setWeeklyPoints(weeklyData ?? 0);

        const allUsers = normalizeDatas(allUsersData)
          .map(u => ({
            id: u.id ?? u.Id,
            name: u.name ?? u.Name ?? "",
            surname: u.surname ?? u.Surname ?? "",
            userName: u.userName ?? u.UserName ?? "",
            totalPoints: parseInt(u.totalPoints ?? u.TotalPoints ?? 0)
          }))
          .sort((a, b) => b.totalPoints - a.totalPoints);
        setGlobalRanking(allUsers);

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

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); setShowDropdown(false); return; }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:5247/api/users`, { headers });
        if (!res.ok) return;
        const data = await res.json();
        const all = normalizeDatas(data);
        const filtered = all
          .filter(u => {
            const un = (u.userName || u.UserName || "").toLowerCase();
            const name = `${u.name || u.Name || ""} ${u.surname || u.Surname || ""}`.toLowerCase();
            const q = searchQuery.toLowerCase();
            return (un.includes(q) || name.includes(q)) &&
              (u.id ?? u.Id) !== parseInt(myId) &&
              !selectedUsers.find(s => s.id === (u.id ?? u.Id));
          })
          .slice(0, 8)
          .map(u => ({
            id: u.id ?? u.Id,
            name: u.name ?? u.Name ?? "",
            surname: u.surname ?? u.Surname ?? "",
            userName: u.userName ?? u.UserName ?? ""
          }));
        setSearchResults(filtered);
        setShowDropdown(filtered.length > 0);
      } catch { }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedUsers]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addUser = (u) => { setSelectedUsers(prev => [...prev, u]); setSearchQuery(""); setShowDropdown(false); };
  const removeUser = (id) => setSelectedUsers(prev => prev.filter(u => u.id !== id));

  const handleCreateLeague = async (e) => {
    e.preventDefault();
    if (!leagueName.trim()) return;
    setCreatingLeague(true);
    try {
      const res = await fetch("http://localhost:5247/api/leagues", {
        method: "POST", headers,
        body: JSON.stringify({
          name: leagueName.trim(),
          participantIds: [parseInt(myId), ...selectedUsers.map(u => u.id)],
          challengeIds: []
        })
      });
      if (!res.ok) throw new Error("Errore creazione lega");
      const newLeague = await res.json();
      showToast("✓ Lega creata!");
      setLeagueName(""); setSelectedUsers([]); setShowCreateLeague(false);
      setLeagues(prev => [...prev, newLeague]);
    } catch (err) { showToast("Errore: " + err.message, true); }
    finally { setCreatingLeague(false); }
  };

  const handleAvatarClick = () => { if (!isOwnProfile) return; fileInputRef.current.click(); };
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]; if (!file) return; e.target.value = "";
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) { showToast("Formato non supportato.", true); return; }
    if (file.size > 10 * 1024 * 1024) { showToast("Immagine troppo grande (max 10MB).", true); return; }
    setUploading(true);
    try {
      const formData = new FormData(); formData.append("file", file);
      const res = await fetch(`http://localhost:5247/api/media/user/${userId}/avatar`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error(await res.text() || "Errore upload");
      const { url } = await res.json();
      setAvatarUrl(url);
      showToast("✓ Foto profilo aggiornata!");
    } catch (err) { showToast("Errore: " + err.message, true); }
    finally { setUploading(false); }
  };

  const getUserPosition = (leagueId) => {
    const ranking = rankings[leagueId] || [];
    const index = ranking.findIndex(u => (u.userName || "").toLowerCase() === (user?.userName || "").toLowerCase());
    return index >= 0 ? index + 1 : null;
  };
  const positionLabel = (pos) => {
    if (!pos) return null;
    if (pos === 1) return { emoji: "🥇", badge: "pg-badge-sun" };
    if (pos === 2) return { emoji: "🥈", badge: "pg-badge-blue" };
    if (pos === 3) return { emoji: "🥉", badge: "pg-badge-blue" };
    return { emoji: "", badge: "pg-badge-blue" };
  };

  if (loading) return (<><style>{sharedStyles}{userPageStyles}</style><div className="pg-root"><div className="pg-loading"><div className="pg-spinner"/></div></div></>);
  if (error)   return (<><style>{sharedStyles}{userPageStyles}</style><div className="pg-root"><div className="pg-alert pg-alert-danger">⚠️ {error}</div></div></>);
  if (!user)   return (<><style>{sharedStyles}{userPageStyles}</style><div className="pg-root"><div className="pg-empty">Utente non trovato</div></div></>);

  const initials    = `${(user.name || "?")[0]}${(user.surname || "?")[0]}`.toUpperCase();
  const totalPoints = user?.totalPoints ?? user?.TotalPoints ?? 0;
  const rankClass   = (i) => i===0?"pg-rank pg-rank-1":i===1?"pg-rank pg-rank-2":i===2?"pg-rank pg-rank-3":"pg-rank";

  return (
    <>
      <style>{sharedStyles}{userPageStyles}</style>

      {toast && <div className={`avatar-toast ${toast.isError ? "avatar-toast-error" : ""}`}>{toast.msg}</div>}
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: "none" }} onChange={handleAvatarChange} />

      <div className="pg-root">
        <div className="pg-content">

      <header className="pg-header">
        <div>
          <p className="pg-eyebrow">SummerSeason</p>
          <h1 className="pg-title">Profilo Utente</h1>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="pg-btn pg-btn-ghost" onClick={() => navigate("/ranking")}>
            🌍 Classifica globale
          </button>
          <button className="pg-btn pg-btn-primary" onClick={() => navigate("/challenges")}>
            🏁 Vai alle sfide
          </button>
        </div>
      </header>

          {/* FORM CREA LEGA */}
          {isOwnProfile && showCreateLeague && (
            <div className="pg-card" style={{ marginBottom: 20 }}>
              <div className="pg-card-header" style={{ justifyContent: "space-between" }}>
                <div className="pg-card-header-left">
                  <div className="pg-card-icon">🏅</div>
                  <h2 className="pg-card-title">Crea una nuova lega</h2>
                </div>
                <button className="pg-btn pg-btn-ghost pg-btn-sm" onClick={() => { setShowCreateLeague(false); setLeagueName(""); setSelectedUsers([]); }}>
                  ✕ Chiudi
                </button>
              </div>
              <div style={{ padding: "20px 24px" }}>
                <form onSubmit={handleCreateLeague}>
                  <div className="pg-grid-2" style={{ gap: 20, marginBottom: 16 }}>
                    <div className="pg-field" style={{ marginBottom: 0 }}>
                      <label className="pg-field-label">Nome lega</label>
                      <input className="pg-input" placeholder="Es. Estate 2026" value={leagueName} onChange={e => setLeagueName(e.target.value)} required />
                    </div>
                    <div className="pg-field" style={{ marginBottom: 0 }}>
                      <label className="pg-field-label">Cerca partecipanti</label>
                      <div className="user-search-wrap" ref={searchRef}>
                        <input
                          className="pg-input"
                          placeholder="Cerca per username o nome..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                          autoComplete="off"
                        />
                        {showDropdown && (
                          <div className="user-search-dropdown" ref={dropdownRef}>
                            {searchResults.map(u => (
                              <div key={u.id} className="user-search-item" onMouseDown={() => addUser(u)}>
                                <div className="user-search-avatar">{(u.name[0] ?? "?").toUpperCase()}</div>
                                <div>
                                  <div style={{ fontWeight: 600, color: "var(--text)" }}>{u.name} {u.surname}</div>
                                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>@{u.userName}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedUsers.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
                        Partecipanti selezionati ({selectedUsers.length + 1} incluso te)
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        <div className="selected-user-chip" style={{ background: "rgba(251,191,36,0.1)", borderColor: "rgba(251,191,36,0.3)", color: "var(--sun-dark)" }}>
                          Tu (admin)
                        </div>
                        {selectedUsers.map(u => (
                          <div key={u.id} className="selected-user-chip">
                            {u.name} {u.surname}
                            <button type="button" onClick={() => removeUser(u.id)}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button type="submit" className="pg-btn pg-btn-sun" style={{ minWidth: 200 }} disabled={creatingLeague || !leagueName.trim()}>
                    {creatingLeague ? "⏳ Creazione..." : "🏅 Crea lega"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* GRIGLIA PROFILO */}
          <div className="pg-grid-sidebar" style={{ alignItems: "start" }}>

            <div className="pg-col" style={{ gap: 20 }}>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">👤</div><h2 className="pg-card-title">Profilo</h2></div>
                </div>
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <div className="avatar-wrap" onClick={handleAvatarClick} title={isOwnProfile ? "Clicca per cambiare foto" : ""} style={{ cursor: isOwnProfile ? "pointer" : "default" }}>
                    {avatarUrl ? <img src={avatarUrl} alt="avatar" className="avatar-img" /> : <div className="avatar-initials">{initials}</div>}
                    {isOwnProfile && !uploading && <div className="avatar-overlay"><span className="avatar-edit-icon">📷</span></div>}
                    {uploading && <div className="avatar-uploading"><div className="avatar-spinner" /></div>}
                  </div>
                  {isOwnProfile && <p className="avatar-upload-hint">{uploading ? "Caricamento..." : "Clicca per cambiare foto"}</p>}
                  <h3 style={{ fontWeight: 800, fontSize: "1.15rem", marginBottom: 4, color: "var(--text)" }}>{user.name} {user.surname}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 14 }}>{user.userName}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                    {roles.map((r, i) => <span key={i} className="pg-badge pg-badge-blue">{r}</span>)}
                  </div>
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">📊</div><h2 className="pg-card-title">Statistiche</h2></div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <div className="pg-info-row">
                    <span className="pg-info-row-label">Leghe</span>
                    <span className="pg-info-row-value" style={{ color: "var(--ocean)", fontSize: "1.3rem", fontWeight: 800 }}>{leagues.length}</span>
                  </div>
                  <div className="pg-info-row">
                    <span className="pg-info-row-label">Punti totali</span>
                    <span className="pg-info-row-value" style={{ color: "var(--sun)", fontSize: "1.3rem", fontWeight: 800 }}>{totalPoints}</span>
                  </div>
                  <div className="pg-info-row">
                    <span className="pg-info-row-label">Punti questa settimana</span>
                    <span className="pg-info-row-value" style={{ color: "var(--success)", fontSize: "1.3rem", fontWeight: 800 }}>{weeklyPoints}</span>
                  </div>
                </div>
              </div>

              {isOwnProfile && (
                <div className="pg-card" style={{ marginBottom: 0 }}>
                  <div className="pg-card-header">
                    <div className="pg-card-header-left"><div className="pg-card-icon">🏅</div><h2 className="pg-card-title">Crea una lega</h2></div>
                  </div>
                  <div style={{ padding: "16px 24px" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 14, lineHeight: 1.5 }}>
                      Crea una nuova lega e invita altri utenti a partecipare cercandoli per username.
                    </p>
                    <button
                      className="pg-btn pg-btn-sun"
                      style={{ width: "100%" }}
                      onClick={() => { setShowCreateLeague(p => !p); if (!showCreateLeague) window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      {showCreateLeague ? "✕ Annulla" : "🏅 Crea nuova lega"}
                    </button>
                  </div>
                </div>
              )}

            </div>

            <div className="pg-col" style={{ gap: 0 }}>
              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">🏆</div><h2 className="pg-card-title">Le mie leghe</h2></div>
                  {leagues.length > 0 && <span className="pg-badge pg-badge-sun">{leagues.length} leghe</span>}
                </div>

                {leagues.length === 0 ? (
                  <div className="pg-empty" style={{ padding: "48px 0" }}>
                    <div style={{ fontSize: "2rem", marginBottom: 10 }}>🏝️</div>
                    <p style={{ fontWeight: 600, marginBottom: 4 }}>Non sei ancora in nessuna lega</p>
                    <p>Crea la tua prima lega o chiedi a un admin di aggiungerti</p>
                  </div>
                ) : (
                  <div>
                    {leagues.map((league, leagueIdx) => {
                      const pos     = getUserPosition(league.id);
                      const label   = positionLabel(pos);
                      const ranking = rankings[league.id] || [];
                      return (
                        <div key={league.id} style={{ borderBottom: leagueIdx < leagues.length - 1 ? "1px solid var(--border)" : "none" }}>
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
                                  Creata il {new Date(league.creationDate ?? league.CreationDate).toLocaleDateString("it-IT")}
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
                                const isMe = (u.userName||"").toLowerCase() === (user.userName||"").toLowerCase();
                                const medals = ["🥇","🥈","🥉"];
                                return (
                                  <div key={idx} style={{
                                    display:"flex", alignItems:"center", gap:6, padding:"5px 12px",
                                    background: isMe ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.03)",
                                    border: `1px solid ${isMe ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.07)"}`,
                                    borderRadius:20, fontSize:"0.74rem", fontWeight: isMe ? 700 : 500, color:"var(--text)"
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