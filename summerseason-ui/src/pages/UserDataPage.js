import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sharedStyles } from "../style/SharedStyles";
import { userPageStyles } from "../style/SharedStyles";

/* ─── Create League Modal ───────────────────────────────────────────────── */
function CreateLeagueModal({ myId, headers, onClose, onCreated, showToast }) {
  const [leagueName, setLeagueName]     = useState("");
  const [search, setSearch]             = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const searchRef = useRef();

  // Focus search on open
  useEffect(() => { setTimeout(() => searchRef.current?.focus(), 80); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Search users with debounce
  useEffect(() => {
    if (search.length < 1) { setSearchResults([]); return; }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:5247/api/users", { headers });
        if (!res.ok) return;
        const data = await res.json();
        const all = Array.isArray(data) ? data : data.$values ?? [];
        const filtered = all
          .filter((u) => {
            const un   = (u.userName || u.UserName || "").toLowerCase();
            const name = `${u.name || u.Name || ""} ${u.surname || u.Surname || ""}`.toLowerCase();
            const q    = search.toLowerCase();
            return (
              (un.includes(q) || name.includes(q)) &&
              (u.id ?? u.Id) !== parseInt(myId) &&
              !selected.find((s) => s.id === (u.id ?? u.Id))
            );
          })
          .slice(0, 8)
          .map((u) => ({
            id: u.id ?? u.Id,
            name: u.name ?? u.Name ?? "",
            surname: u.surname ?? u.Surname ?? "",
            userName: u.userName ?? u.UserName ?? "",
          }));
        setSearchResults(filtered);
      } catch {}
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, selected]);

  const addUser    = (u) => { setSelected((p) => [...p, u]); setSearch(""); setSearchResults([]); };
  const removeUser = (id) => setSelected((p) => p.filter((u) => u.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leagueName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5247/api/leagues", {
        method: "POST", headers,
        body: JSON.stringify({
          name: leagueName.trim(),
          participantIds: [parseInt(myId), ...selected.map((u) => u.id)],
          challengeIds: [],
        }),
      });
      if (!res.ok) throw new Error("Errore creazione lega");
      const newLeague = await res.json();
      showToast("✓ Lega creata!");
      onCreated(newLeague);
      onClose();
    } catch (err) {
      showToast("Errore: " + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cl-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="cl-box">

        {/* Header */}
        <div className="cl-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="pg-card-icon">🏅</div>
            <h2 className="pg-card-title" style={{ fontSize: "1rem" }}>Crea nuova lega</h2>
          </div>
          <button className="cl-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cl-body">

            {/* League name */}
            <div className="pg-field" style={{ marginBottom: 20 }}>
              <label className="pg-field-label">Nome lega</label>
              <input
                className="pg-input"
                placeholder="Es. Estate 2026"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                required
              />
            </div>

            {/* Search */}
            <div className="pg-field" style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <label className="pg-field-label" style={{ margin: 0 }}>
                  Partecipanti
                  {selected.length > 0 && (
                    <span className="cl-count">{selected.length + 1} totali</span>
                  )}
                </label>
                {selected.length > 0 && (
                  <button type="button" className="cl-text-btn cl-text-btn--danger" onClick={() => setSelected([])}>
                    Rimuovi tutti
                  </button>
                )}
              </div>

              <div className="cl-search-wrap">
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.3)" }}>🔍</span>
                <input
                  ref={searchRef}
                  className="cl-search-input"
                  placeholder="Cerca per nome o username…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoComplete="off"
                />
                {search && (
                  <button type="button" className="cl-search-clear" onClick={() => { setSearch(""); setSearchResults([]); }}>✕</button>
                )}
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="cl-results">
                  {searchResults.map((u) => (
                    <div
                      key={u.id}
                      className="cl-result-item"
                      onMouseDown={(e) => { e.preventDefault(); addUser(u); }}
                    >
                      <div className="cl-avatar">{(u.name?.[0] ?? "?").toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.83rem", color: "var(--text)" }}>{u.name} {u.surname}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>@{u.userName}</div>
                      </div>
                      <span className="cl-add-hint">+ Aggiungi</span>
                    </div>
                  ))}
                </div>
              )}
              {search.length >= 1 && searchResults.length === 0 && (
                <div className="cl-no-results">Nessun risultato per "{search}"</div>
              )}
            </div>

            {/* Selected chips */}
            {(selected.length > 0) && (
              <div style={{ marginTop: 16 }}>
                <p className="cl-chips-label">Partecipanti ({selected.length + 1})</p>
                <div className="cl-chips">
                  {/* Self chip */}
                  <div className="participant-chip participant-chip-you">
                    <div className="participant-chip-avatar">Tu</div>
                    <span>Tu (admin)</span>
                  </div>
                  {selected.map((u) => (
                    <div key={u.id} className="participant-chip">
                      <div className="participant-chip-avatar">{(u.name?.[0] ?? "?").toUpperCase()}</div>
                      <span>{u.name} {u.surname}</span>
                      <button type="button" className="participant-chip-remove" onClick={() => removeUser(u.id)} title="Rimuovi">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="cl-footer">
            <button type="button" className="cl-btn-cancel" onClick={onClose}>Annulla</button>
            <button
              type="submit"
              className="pg-btn pg-btn-sun"
              style={{ minWidth: 160 }}
              disabled={loading || !leagueName.trim()}
            >
              {loading ? "⏳ Creazione…" : "🏅 Crea lega"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
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
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [avatarUrl, setAvatarUrl]       = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [toast, setToast]               = useState(null);
  const [showCreateLeague, setShowCreateLeague] = useState(false);

  const fileInputRef = useRef();
  const navigate     = useNavigate();

  const modalStyles = `
    /* ── Modal overlay ── */
    .cl-overlay {
      position: fixed; inset: 0; z-index: 1000;
      background: rgba(0,0,0,0.65);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: clFadeIn 0.15s ease;
    }
    @keyframes clFadeIn { from { opacity: 0 } to { opacity: 1 } }

    .cl-box {
      background: #0f1623;
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 16px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.6);
      width: 100%; max-width: 500px;
      max-height: 90vh;
      display: flex; flex-direction: column;
      animation: clSlideUp 0.18s ease;
    }
    @keyframes clSlideUp {
      from { transform: translateY(16px); opacity: 0 }
      to   { transform: translateY(0);    opacity: 1 }
    }

    .cl-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      flex-shrink: 0;
    }
    .cl-close {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5); border-radius: 8px;
      width: 30px; height: 30px; cursor: pointer; font-size: 0.7rem;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .cl-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

    .cl-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .cl-footer {
      padding: 14px 20px;
      border-top: 1px solid rgba(255,255,255,0.07);
      display: flex; align-items: center; justify-content: flex-end; gap: 10px;
      flex-shrink: 0;
    }
    .cl-btn-cancel {
      padding: 10px 20px; border-radius: 8px;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5); font-family: inherit; font-size: 0.85rem;
      cursor: pointer; transition: all 0.15s;
    }
    .cl-btn-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }

    /* Search */
    .cl-search-wrap {
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px; padding: 8px 12px;
      margin-bottom: 8px;
      transition: border-color 0.15s;
    }
    .cl-search-wrap:focus-within { border-color: rgba(96,165,250,0.35); }
    .cl-search-input {
      flex: 1; background: transparent; border: none; outline: none;
      color: var(--text); font-size: 0.83rem; font-family: inherit;
    }
    .cl-search-input::placeholder { color: rgba(255,255,255,0.25); }
    .cl-search-clear {
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,0.35); font-size: 0.7rem; padding: 0; line-height: 1;
    }

    /* Results list */
    .cl-results {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px; overflow: hidden; margin-bottom: 4px;
    }
    .cl-result-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px; cursor: pointer;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: background 0.12s;
    }
    .cl-result-item:last-child { border-bottom: none; }
    .cl-result-item:hover { background: rgba(96,165,250,0.08); }
    .cl-add-hint {
      margin-left: auto; font-size: 0.68rem; font-weight: 700;
      color: var(--ocean); opacity: 0; transition: opacity 0.12s;
    }
    .cl-result-item:hover .cl-add-hint { opacity: 1; }

    .cl-no-results {
      font-size: 0.78rem; color: var(--text-muted);
      padding: 10px 2px;
    }

    .cl-avatar {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, rgba(96,165,250,0.25), rgba(251,191,36,0.2));
      border: 1px solid rgba(96,165,250,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.78rem; font-weight: 800; color: #60a5fa;
    }

    /* Chips */
    .cl-chips-label {
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px;
    }
    .cl-chips { display: flex; flex-wrap: wrap; gap: 8px; }

    .cl-count {
      margin-left: 8px; font-size: 0.68rem; font-weight: 700;
      padding: 2px 8px; border-radius: 20px;
      background: rgba(96,165,250,0.12);
      border: 1px solid rgba(96,165,250,0.2);
      color: var(--ocean);
      text-transform: none; letter-spacing: 0;
    }

    /* Text buttons */
    .cl-text-btn {
      background: none; border: none; cursor: pointer;
      font-size: 0.72rem; font-weight: 600; color: var(--ocean);
      font-family: inherit; padding: 2px 4px; transition: opacity 0.12s;
    }
    .cl-text-btn:hover { opacity: 0.7; }
    .cl-text-btn--danger { color: #f87171; }

    /* Participant chips (reuse from original) */
    .participant-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0; }
    .participant-chip {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px 6px 6px; border-radius: 30px;
      background: rgba(96,165,250,0.08); border: 1px solid rgba(96,165,250,0.2);
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
      background: rgba(251,191,36,0.08); border-color: rgba(251,191,36,0.25); color: #fbbf24;
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

  const normalizeDatas = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };
  const normalizeUserRanking = (u) => ({
    name: u.name || u.Name, surname: u.surname || u.Surname,
    userName: u.userName || u.UserName,
    totalPoints: parseInt(u.totalPoints ?? u.TotalPoints ?? 0),
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
            const res  = await fetch(`http://localhost:5247/api/leagues/${league.id}/ranking`, { headers });
            const data = await res.json();
            rankingMap[league.id] = normalizeDatas(data).map(normalizeUserRanking);
          }));
        }
        setRankings(rankingMap);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleAvatarClick  = () => { if (!isOwnProfile) return; fileInputRef.current.click(); };
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
    const index   = ranking.findIndex((u) => (u.userName || "").toLowerCase() === (user?.userName || "").toLowerCase());
    return index >= 0 ? index + 1 : null;
  };
  const positionLabel = (pos) => {
    if (!pos) return null;
    if (pos === 1) return { emoji: "🥇", badge: "pg-badge-sun" };
    if (pos === 2) return { emoji: "🥈", badge: "pg-badge-blue" };
    if (pos === 3) return { emoji: "🥉", badge: "pg-badge-blue" };
    return { emoji: "", badge: "pg-badge-blue" };
  };

  if (loading) return (<><style>{sharedStyles}{userPageStyles}{modalStyles}</style><div className="pg-root"><div className="pg-loading"><div className="pg-spinner"/></div></div></>);
  if (error)   return (<><style>{sharedStyles}{userPageStyles}{modalStyles}</style><div className="pg-root"><div className="pg-alert pg-alert-danger">⚠️ {error}</div></div></>);
  if (!user)   return (<><style>{sharedStyles}{userPageStyles}{modalStyles}</style><div className="pg-root"><div className="pg-empty">Utente non trovato</div></div></>);

  const initials    = `${(user.name || "?")[0]}${(user.surname || "?")[0]}`.toUpperCase();
  const totalPoints = user?.totalPoints ?? user?.TotalPoints ?? 0;

  return (
    <>
      <style>{sharedStyles}{userPageStyles}{modalStyles}</style>

      {toast && <div className={`avatar-toast ${toast.isError ? "avatar-toast-error" : ""}`}>{toast.msg}</div>}
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: "none" }} onChange={handleAvatarChange} />

      {/* Modal */}
      {showCreateLeague && (
        <CreateLeagueModal
          myId={myId}
          headers={headers}
          onClose={() => setShowCreateLeague(false)}
          onCreated={(newLeague) => setLeagues((prev) => [...prev, newLeague])}
          showToast={showToast}
        />
      )}

      <div className="pg-root">
        <div className="pg-content">

          <header className="pg-header">
            <div>
              <p className="pg-eyebrow">SummerSeason</p>
              <h1 className="pg-title">Profilo Utente</h1>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="pg-btn pg-btn-ghost" onClick={() => navigate("/ranking")}>🌍 Classifica globale</button>
              <button className="pg-btn pg-btn-primary" onClick={() => navigate("/challenges")}>🏁 Vai alle sfide</button>
            </div>
          </header>

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
                      onClick={() => setShowCreateLeague(true)}
                    >
                      🏅 Crea nuova lega
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
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", cursor: "pointer", background: "rgba(255,255,255,0.02)", transition: "background 0.15s", gap: 12 }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(96,165,250,0.07)"}
                            onMouseOut={(e)  => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              {pos ? (
                                <span className={`pg-badge ${label.badge}`} style={{ fontSize: "0.75rem", padding: "5px 12px", fontWeight: 800, flexShrink: 0 }}>
                                  {label.emoji} #{pos}
                                </span>
                              ) : (
                                <span style={{ width: 36, height: 28, borderRadius: 20, background: "rgba(255,255,255,0.06)", display: "inline-block", flexShrink: 0 }} />
                              )}
                              <div>
                                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{league.name}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 1 }}>
                                  Creata il {new Date(league.creationDate ?? league.CreationDate).toLocaleDateString("it-IT")}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                              {ranking.length > 0 && (() => {
                                const me = ranking.find((u) => (u.userName || "").toLowerCase() === (user.userName || "").toLowerCase());
                                return me ? <span className="pg-badge pg-badge-green">{me.totalPoints} pts</span> : null;
                              })()}
                              <span style={{ color: "var(--text-light)", fontSize: "0.8rem" }}>→</span>
                            </div>
                          </div>

                          {ranking.length > 0 && (
                            <div style={{ padding: "0 24px 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {ranking.slice(0, 3).map((u, idx) => {
                                const isMe   = (u.userName || "").toLowerCase() === (user.userName || "").toLowerCase();
                                const medals = ["🥇", "🥈", "🥉"];
                                return (
                                  <div key={idx} style={{
                                    display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
                                    background: isMe ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.03)",
                                    border: `1px solid ${isMe ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.07)"}`,
                                    borderRadius: 20, fontSize: "0.74rem", fontWeight: isMe ? 700 : 500, color: "var(--text)",
                                  }}>
                                    <span>{medals[idx]}</span>
                                    <span>{u.name} {u.surname}</span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>{u.totalPoints} pts</span>
                                  </div>
                                );
                              })}
                              {ranking.length > 3 && (
                                <div style={{ display: "flex", alignItems: "center", padding: "5px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, fontSize: "0.72rem", color: "var(--text-muted)" }}>
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