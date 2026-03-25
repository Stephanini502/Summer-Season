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

  const [user, setUser]                   = useState(null);
  const [roles, setRoles]                 = useState([]);
  const [leagues, setLeagues]             = useState([]);
  const [rankings, setRankings]           = useState({});
  const [weeklyPoints, setWeeklyPoints]   = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [avatarUrl, setAvatarUrl]         = useState(null);
  const [uploading, setUploading]         = useState(false);
  const [toast, setToast]                 = useState(null);

  const [showCreateLeague, setShowCreateLeague] = useState(false);
  const [leagueName, setLeagueName]             = useState("");
  const [searchQuery, setSearchQuery]           = useState("");
  const [searchResults, setSearchResults]       = useState([]);
  const [selectedUsers, setSelectedUsers]       = useState([]);
  const [creatingLeague, setCreatingLeague]     = useState(false);
  const [showDropdown, setShowDropdown]         = useState(false);
  const [dropdownPos, setDropdownPos]           = useState({ top: 0, left: 0, width: 0 });

  const fileInputRef  = useRef();
  const searchInputRef = useRef();
  const dropdownRef   = useRef();
  const navigate      = useNavigate();

  const extraStyles = `
    .league-search-wrap { 
      position: relative; /* Questo è fondamentale */
    }

    .league-search-dropdown {
      position: absolute; /* Cambiato da fixed a absolute */
      z-index: 9999;
      top: 100%; /* Si attacca esattamente sotto l'input */
      left: 0;
      width: 100%; /* Prende la stessa larghezza dell'input */
      margin-top: 4px;
      background: #0f1623;
      border: 1px solid rgba(96,165,250,0.2);
      border-radius: 12px;
      max-height: 220px; 
      overflow-y: auto;
      box-shadow: 0 16px 48px rgba(0,0,0,0.5);
    }
    .league-search-item {
      padding: 11px 16px; cursor: pointer;
      display: flex; align-items: center; gap: 10px;
      transition: background 0.14s; font-size: 0.83rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
    }
    .league-search-item:last-child { border-bottom: none; }
    .league-search-item:hover { background: rgba(96,165,250,0.08); }
    .league-search-avatar {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, rgba(96,165,250,0.25), rgba(251,191,36,0.2));
      border: 1px solid rgba(96,165,250,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.78rem; font-weight: 800; color: #60a5fa;
    }
    .league-search-name { fontWeight: 600; color: var(--text); font-size: 0.83rem; }
    .league-search-handle { font-size: 0.7rem; color: var(--text-muted); margin-top: 1px; }

    .participant-chips {
      display: flex; flex-wrap: wrap; gap: 8px;
      padding: 12px 0 4px;
    }
    .participant-chip {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px 6px 6px; border-radius: 30px;
      background: rgba(96,165,250,0.08);
      border: 1px solid rgba(96,165,250,0.2);
      font-size: 0.78rem; font-weight: 600; color: var(--text);
      transition: border-color 0.15s;
    }
    .participant-chip:hover { border-color: rgba(248,113,113,0.4); }
    .participant-chip-avatar {
      width: 24px; height: 24px; border-radius: 50%;
      background: linear-gradient(135deg, rgba(96,165,250,0.3), rgba(251,191,36,0.2));
      display: flex; align-items: center; justify-content: center;
      font-size: 0.65rem; font-weight: 800; color: #60a5fa; flex-shrink: 0;
    }
    .participant-chip-you {
      background: rgba(251,191,36,0.08);
      border-color: rgba(251,191,36,0.25);
      color: #fbbf24;
    }
    .participant-chip-you .participant-chip-avatar {
      background: linear-gradient(135deg, rgba(251,191,36,0.3), rgba(251,191,36,0.1));
      color: #fbbf24;
    }
    .participant-chip-remove {
      background: none; border: none; cursor: pointer;
      color: var(--text-muted); font-size: 0.72rem;
      display: flex; align-items: center; justify-content: center;
      width: 16px; height: 16px; border-radius: 50%;
      transition: all 0.15s; padding: 0;
    }
    .participant-chip-remove:hover { background: rgba(248,113,113,0.2); color: #f87171; }
  `;

  const calcDropdownPos = () => {
    if (!searchInputRef.current) return;
    const rect = searchInputRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  };

  const normalizeDatas = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };
  const normalizeUserRanking = (u) => ({
    name: u.name || u.Name, surname: u.surname || u.Surname,
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
        if (filtered.length > 0) {
          calcDropdownPos();
          setShowDropdown(true);
        } else {
          setShowDropdown(false);
        }
      } catch { }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedUsers]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!showDropdown) return;
      if (dropdownRef.current?.contains(e.target)) return;
      if (searchInputRef.current?.contains(e.target)) return;
      setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

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

  if (loading) return (<><style>{sharedStyles}{userPageStyles}{extraStyles}</style><div className="pg-root"><div className="pg-loading"><div className="pg-spinner"/></div></div></>);
  if (error)   return (<><style>{sharedStyles}{userPageStyles}{extraStyles}</style><div className="pg-root"><div className="pg-alert pg-alert-danger">⚠️ {error}</div></div></>);
  if (!user)   return (<><style>{sharedStyles}{userPageStyles}{extraStyles}</style><div className="pg-root"><div className="pg-empty">Utente non trovato</div></div></>);

  const initials    = `${(user.name || "?")[0]}${(user.surname || "?")[0]}`.toUpperCase();
  const totalPoints = user?.totalPoints ?? user?.TotalPoints ?? 0;
  const rankClass   = (i) => i===0?"pg-rank pg-rank-1":i===1?"pg-rank pg-rank-2":i===2?"pg-rank pg-rank-3":"pg-rank";

  return (
    <>
      <style>{sharedStyles}{userPageStyles}{extraStyles}</style>

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
              <button className="pg-btn pg-btn-ghost" onClick={() => navigate("/ranking")}>🌍 Classifica globale</button>
              <button className="pg-btn pg-btn-primary" onClick={() => navigate("/challenges")}>🏁 Vai alle sfide</button>
            </div>
          </header>

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
                      <input
                        className="pg-input"
                        placeholder="Es. Estate 2026"
                        value={leagueName}
                        onChange={e => setLeagueName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="pg-field" style={{ marginBottom: 0 }}>
                      <label className="pg-field-label">Cerca partecipanti</label>
                      <div className="league-search-wrap">
                        <input
                          ref={searchInputRef}
                          className="pg-input"
                          placeholder="Digita nome o username..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          onFocus={() => {
                            calcDropdownPos();
                            if (searchResults.length > 0) setShowDropdown(true);
                          }}
                          autoComplete="off"
                        />
                        {showDropdown && (
                          <div
                            className="league-search-dropdown"
                            ref={dropdownRef}
                          >
                            {searchResults.map(u => (
                              <div 
                                key={u.id} 
                                className="league-search-item" 
                                onMouseDown={(e) => {
                                  e.preventDefault(); 
                                  addUser(u);
                                }}
                              >
                                <div className="league-search-avatar">{(u.name[0] ?? "?").toUpperCase()}</div>
                                <div>
                                  <div className="league-search-name">{u.name} {u.surname}</div>
                                  <div className="league-search-handle">@{u.userName}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {(selectedUsers.length > 0) && (
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>
                        Partecipanti ({selectedUsers.length + 1})
                      </p>
                      <div className="participant-chips">
                        {/* Tu */}
                        <div className="participant-chip participant-chip-you">
                          <div className="participant-chip-avatar">Tu</div>
                          <span>Tu (admin)</span>
                        </div>
                        {selectedUsers.map(u => (
                          <div key={u.id} className="participant-chip">
                            <div className="participant-chip-avatar">{(u.name[0] ?? "?").toUpperCase()}</div>
                            <span>{u.name} {u.surname}</span>
                            <button
                              type="button"
                              className="participant-chip-remove"
                              onClick={() => removeUser(u.id)}
                              title="Rimuovi"
                            >✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="pg-btn pg-btn-sun"
                    style={{ minWidth: 200 }}
                    disabled={creatingLeague || !leagueName.trim()}
                  >
                    {creatingLeague ? "⏳ Creazione..." : "🏅 Crea lega"}
                  </button>
                </form>
              </div>
            </div>
          )}

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