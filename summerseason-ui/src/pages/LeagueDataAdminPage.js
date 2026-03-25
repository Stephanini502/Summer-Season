import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { sharedStyles } from "../style/SharedStyles";
import { mediaStyles } from "../style/SharedStyles";

const ADMIN_ROLE   = 0;
const REFEREE_ROLE = 1;

function LeagueDataAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [league, setLeague]                           = useState(null);
  const [participants, setParticipants]               = useState([]); 
  const [referees, setReferees]                       = useState([]); 
  const [allUsers, setAllUsers]                       = useState([]); 
  const [allEligibleReferees, setAllEligibleReferees] = useState([]); 
  const [selectedUserId, setSelectedUserId]           = useState("");
  const [selectedRefereeId, setSelectedRefereeId]     = useState("");
  const [challenges, setChallenges]                   = useState([]);
  const [loading, setLoading]                         = useState(true);
  const [error, setError]                             = useState("");
  const [uploadingFor, setUploadingFor]               = useState(null);
  const [uploadProgress, setUploadProgress]           = useState(null);
  const fileInputRef = useRef();
  const [lightbox, setLightbox]                       = useState(null);

  const token   = localStorage.getItem("jwtToken");
  const headers = { Authorization: `Bearer ${token}` };

  /* ── normalize ── */
  const normalizeValues = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };

  const normalizeMedia = (m) => ({
    id:   m.id  ?? m.Id,
    url:  m.url ?? m.Url ?? "",
    type: (m.type ?? m.Type ?? "image").toLowerCase(),
  });

  const normalizeUser = (u) => {
    let roles = u.roles ?? u.Roles ?? [];
    if (roles && roles.$values) roles = roles.$values;
    if (!Array.isArray(roles)) roles = [];
    return {
      id:          u.id      ?? u.Id,
      name:        u.name    ?? u.Name    ?? "",
      surname:     u.surname ?? u.Surname ?? "",
      userName:    u.userName ?? u.UserName ?? "",
      roles,
      totalPoints: u.totalPoints ?? u.TotalPoints ?? 0,
    };
  };

  const normalizeChallenge = (c) => ({
    id:          c.id          ?? c.Id,
    name:        c.name        ?? c.Name        ?? "",
    description: c.description ?? c.Description ?? "",
    points:      c.points      ?? c.Points      ?? 0,
    media:       normalizeValues(c.media ?? c.Media).map(normalizeMedia),
  });

  const normalizeLeague = (l) => ({
    ...l,
    media: normalizeValues(l.media ?? l.Media).map(normalizeMedia),
  });

  const isParticipant     = (u) => !u.roles.includes(ADMIN_ROLE) && !u.roles.includes(REFEREE_ROLE);
  const isEligibleReferee = (u) => !u.roles.includes(ADMIN_ROLE);

  const fetchLeagueData = async () => {
    setLoading(true); setError("");
    try {
      const [leagueData, rankingData, participantsData, challengesData, mediaData, usersData, refereesData] = await Promise.all([
        fetch(`http://localhost:5247/api/leagues/${id}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/leagues/${id}/participants`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/challenges/${id}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/media/league/${id}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/users`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/leagues/${id}/referees`, { headers }).then(r => r.json()), // ← nuovo
      ]);

      const normalized = normalizeLeague(leagueData);
      normalized.media = normalizeValues(mediaData).map(normalizeMedia);
      setLeague(normalized);

      const allNormalized = normalizeValues(usersData).map(normalizeUser);
      const rolesById = {};
      allNormalized.forEach(u => { rolesById[u.id] = u.roles; });

      const allMembers = normalizeValues(participantsData).map(u => ({
        ...normalizeUser(u),
        roles: rolesById[u.id ?? u.Id] ?? [],
      }));

      const leagueReferees = normalizeValues(refereesData).map(normalizeUser);
      setReferees(leagueReferees);
      const refereeIds = new Set(leagueReferees.map(r => r.id));
      
      const allRanked = normalizeValues(rankingData).map(u => ({
        ...normalizeUser(u),
        roles: rolesById[u.id ?? u.Id] ?? [],
      }));

      setParticipants(
        allRanked
          .filter(isParticipant)
          .sort((a, b) => b.totalPoints - a.totalPoints)
      );

      setChallenges(normalizeValues(challengesData).map(normalizeChallenge));

      const memberIds = new Set(allMembers.map(m => m.id));

      setAllUsers(allNormalized.filter(u =>
        !memberIds.has(u.id) && isParticipant(u)
      ));

      setAllEligibleReferees(
        allNormalized.filter(u =>
          !u.roles.includes(ADMIN_ROLE) && !refereeIds.has(u.id)
        )
      );

    } catch (err) {
      console.error(err);
      setError("Errore caricamento dati lega");
    } finally {
      setLoading(false);
    }
  };

    const refreshAll = async () => {
      try {
        const [rankingData, participantsData, usersData, refereesData] = await Promise.all([
          fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers }).then(r => r.json()),
          fetch(`http://localhost:5247/api/leagues/${id}/participants`, { headers }).then(r => r.json()),
          fetch(`http://localhost:5247/api/users`, { headers }).then(r => r.json()),
          fetch(`http://localhost:5247/api/leagues/${id}/referees`, { headers }).then(r => r.json()),
        ]);

        const allNormalized = normalizeValues(usersData).map(normalizeUser);
        const leagueReferees = normalizeValues(refereesData).map(normalizeUser);
        setReferees(leagueReferees);
        const refereeIds = new Set(leagueReferees.map(r => r.id));

        const allMembers = normalizeValues(participantsData).map(normalizeUser);
        const memberIds = new Set(allMembers.map(m => m.id));

        const allRanked = normalizeValues(rankingData).map(normalizeUser);
        setParticipants(allRanked.filter(isParticipant).sort((a, b) => b.totalPoints - a.totalPoints));

        setAllUsers(allNormalized.filter(u => !memberIds.has(u.id) && isParticipant(u)));
        setAllEligibleReferees(allNormalized.filter(u => !u.roles.includes(ADMIN_ROLE) && !refereeIds.has(u.id)));
      } catch (err) { console.error("Errore refresh:", err); }
    };

  useEffect(() => { fetchLeagueData(); }, [id]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(prev => { const n=(prev.index+1)%prev.allImages.length; return {...prev,url:prev.allImages[n].url,index:n}; });
      if (e.key === "ArrowLeft")  setLightbox(prev => { const n=(prev.index-1+prev.allImages.length)%prev.allImages.length; return {...prev,url:prev.allImages[n].url,index:n}; });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const openLightbox = (images, index) => setLightbox({ url: images[index].url, allImages: images, index });

  const handleDownload = async (url) => {
    try {
      const blob = await fetch(url).then(r => r.blob());
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: url.split("/").pop().split("?")[0] || "file" });
      a.click(); URL.revokeObjectURL(a.href);
    } catch { window.open(url, "_blank"); }
  };

  const handleAddParticipant = async () => {
    if (!selectedUserId) return;
    try {
      const res = await fetch(`http://localhost:5247/api/leagues/${id}/participants/${selectedUserId}`, { method: "POST", headers });
      if (!res.ok) throw new Error("Errore aggiunta");
      setSelectedUserId(""); await refreshAll();
    } catch (err) { alert(err.message); }
  };

  const handleRemoveParticipant = async (uid, name) => {
    if (!window.confirm(`Rimuovere ${name} dalla lega?`)) return;
    try {
      const res = await fetch(`http://localhost:5247/api/leagues/${id}/${uid}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Errore rimozione");
      await refreshAll();
    } catch (err) { alert(err.message); }
  };

    const handleSetReferee = async () => {
      if (!selectedRefereeId) return;
      try {
        const res = await fetch(
          `http://localhost:5247/api/leagues/${id}/referees/${selectedRefereeId}`,
          { method: "POST", headers }
        );
        if (!res.ok) throw new Error("Errore assegnazione");
        setSelectedRefereeId("");
        await refreshAll();
      } catch (err) { alert(err.message); }
    };

  const triggerUpload = (type, entityId, mediaType) => {
    setUploadingFor({ type, id: entityId, mediaType });
    fileInputRef.current.accept = mediaType === "image" ? "image/*" : "video/*";
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; if (!file || !uploadingFor) return; e.target.value = "";
    const { type, id: entityId, mediaType } = uploadingFor;
    const endpoint = type === "league"
      ? `http://localhost:5247/api/media/league/${entityId}?type=${mediaType}`
      : `http://localhost:5247/api/media/challenge/${entityId}?type=${mediaType}&leagueId=${id}`;
    setUploadProgress(`Caricamento ${mediaType === "image" ? "immagine" : "video"}...`);
    try {
      const fd = new FormData(); fd.append("file", file);
      const uploadRes = await fetch(endpoint, { method: "POST", headers, body: fd });
      if (!uploadRes.ok) throw new Error("Errore upload");
      const { id: mediaId, url, type: mType } = await uploadRes.json();
      const newMedia = { id: mediaId, url, type: mType };
      if (type === "league") setLeague(prev => ({ ...prev, media: [...(prev.media || []), newMedia] }));
      else setChallenges(prev => prev.map(c => c.id === entityId ? { ...c, media: [...(c.media || []), newMedia] } : c));
    } catch (err) { alert("Errore: " + err.message); }
    finally { setUploadProgress(null); setUploadingFor(null); }
  };

  const handleDeleteMedia = async (mediaId, type, entityId) => {
    if (!window.confirm("Eliminare questo media?")) return;
    try {
      const res = await fetch(`http://localhost:5247/api/media/${mediaId}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Errore eliminazione");
      if (type === "league") setLeague(prev => ({ ...prev, media: prev.media.filter(m => m.id !== mediaId) }));
      else setChallenges(prev => prev.map(c => c.id === entityId ? { ...c, media: c.media.filter(m => m.id !== mediaId) } : c));
    } catch (err) { alert(err.message); }
  };

  const rankClass = (i) => i === 0 ? "pg-rank pg-rank-1" : i === 1 ? "pg-rank pg-rank-2" : i === 2 ? "pg-rank pg-rank-3" : "pg-rank";

  if (loading) return (<><style>{sharedStyles}{mediaStyles}</style><div className="pg-root"><div className="pg-loading"><div className="pg-spinner" /></div></div></>);
  if (error)   return (<><style>{sharedStyles}{mediaStyles}</style><div className="pg-root"><div className="pg-alert pg-alert-danger">⚠️ {error}</div></div></>);
  if (!league) return (<><style>{sharedStyles}{mediaStyles}</style><div className="pg-root"><div className="pg-empty">Lega non trovata</div></div></>);

  const leagueImages   = (league.media || []).filter(m => m.type === "image");
  const leagueVideos   = (league.media || []).filter(m => m.type === "video");
  const participantIds = new Set(participants.map(p => p.id));

  return (
    <>
      <style>{sharedStyles}{mediaStyles}</style>

      {lightbox && (
        <div className="lb-backdrop" onClick={() => setLightbox(null)}>
          <img src={lightbox.url} className="lb-img" onClick={e => e.stopPropagation()} alt="anteprima" />
          <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lb-download" onClick={e => { e.stopPropagation(); handleDownload(lightbox.url); }}>⬇ Scarica</button>
          {lightbox.allImages.length > 1 && (<>
            <button className="lb-arrow lb-arrow-left" onClick={e => { e.stopPropagation(); setLightbox(prev => { const n=(prev.index-1+prev.allImages.length)%prev.allImages.length; return {...prev,url:prev.allImages[n].url,index:n}; }); }}>‹</button>
            <button className="lb-arrow lb-arrow-right" onClick={e => { e.stopPropagation(); setLightbox(prev => { const n=(prev.index+1)%prev.allImages.length; return {...prev,url:prev.allImages[n].url,index:n}; }); }}>›</button>
            <div className="lb-counter">{lightbox.index + 1} / {lightbox.allImages.length}</div>
          </>)}
        </div>
      )}

      <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />

      <div className="pg-root">
        <div className="pg-content">

          <div className="pg-hero">
            <div>
              <p className="pg-hero-eyebrow">Admin · Gestione Lega</p>
              <h1 className="pg-hero-title">{league.name}</h1>
              <p className="pg-hero-sub">Creata il {new Date(league.creationDate).toLocaleDateString("it-IT")}</p>
            </div>
            <button className="pg-btn-hero" onClick={() => navigate("/challenges")}>🏁 Vai alle sfide</button>
          </div>

          <div className="pg-stats">
            <div className="pg-stat-card"><div><p className="pg-stat-label">Partecipanti</p><p className="pg-stat-value">{participants.length}</p></div><div className="pg-stat-icon">👥</div></div>
            <div className="pg-stat-card"><div><p className="pg-stat-label">Arbitri</p><p className="pg-stat-value">{referees.length}</p></div><div className="pg-stat-icon pg-stat-icon-yellow">⚖️</div></div>
            <div className="pg-stat-card"><div><p className="pg-stat-label">Sfide</p><p className="pg-stat-value">{challenges.length}</p></div><div className="pg-stat-icon">🏁</div></div>
            <div className="pg-stat-card"><div><p className="pg-stat-label">Media caricati</p><p className="pg-stat-value">{(league.media || []).length}</p></div><div className="pg-stat-icon">🖼️</div></div>
          </div>

          <div className="pg-card" style={{ marginBottom: 0 }}>
            <div className="pg-card-header">
              <div className="pg-card-header-left"><div className="pg-card-icon">🖼️</div><h2 className="pg-card-title">Media della lega</h2></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {uploadProgress && <span className="media-progress">⏳ {uploadProgress}</span>}
                <span className="pg-badge pg-badge-blue">{(league.media || []).length} file</span>
              </div>
            </div>
            <div className="media-section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <p className="media-block-title">📷 Immagini ({leagueImages.length})</p>
                {leagueImages.length > 0 && (
                  <div className="media-grid" style={{ marginBottom: 10 }}>
                    {leagueImages.map((m, idx) => (
                      <div key={m.id} className="media-item">
                        <img src={m.url} alt="" className="media-thumb" onClick={() => openLightbox(leagueImages, idx)} />
                        <div className="media-item-overlay">
                          <button className="media-icon-btn media-icon-btn-view" onClick={() => openLightbox(leagueImages, idx)}>🔍</button>
                          <button className="media-icon-btn media-icon-btn-dl" onClick={() => handleDownload(m.url)}>⬇️</button>
                          <button className="media-icon-btn media-icon-btn-del" onClick={() => handleDeleteMedia(m.id, "league", league.id)}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="media-upload-btn" onClick={() => triggerUpload("league", league.id, "image")}>📷 {leagueImages.length > 0 ? "Aggiungi immagine" : "Carica immagine"}</button>
              </div>
              <div>
                <p className="media-block-title">🎬 Video ({leagueVideos.length})</p>
                {leagueVideos.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
                    {leagueVideos.map(m => (
                      <div key={m.id} className="video-wrap media-item" style={{ padding: 6 }}>
                        <video src={m.url} controls className="media-video" />
                        <div className="video-actions">
                          <button className="video-icon-btn" onClick={() => handleDownload(m.url)} style={{ background: "#3b82f6" }}>⬇️</button>
                          <button className="video-icon-btn" onClick={() => handleDeleteMedia(m.id, "league", league.id)} style={{ background: "#ef4444" }}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="media-upload-btn" onClick={() => triggerUpload("league", league.id, "video")}>🎬 {leagueVideos.length > 0 ? "Aggiungi video" : "Carica video"}</button>
              </div>
            </div>
          </div>

          {challenges.length > 0 && (
            <div className="pg-card" style={{ marginBottom: 0 , marginTop: 20}}>
              <div className="pg-card-header">
                <div className="pg-card-header-left"><div className="pg-card-icon">🏁</div><h2 className="pg-card-title">Sfide</h2></div>
                <span className="pg-badge pg-badge-sun">{challenges.length} sfide</span>
              </div>
              {challenges.map(c => {
                return (
                  <div key={c.id} className="challenge-item">
                    <div className="pg-list-item" style={{ borderBottom: "none" }}>
                      <div><div className="pg-list-item-name">{c.name}</div><div className="pg-list-item-sub">{c.description}</div></div>
                      <span className="pg-badge pg-badge-green">+{c.points} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pg-grid-sidebar" style={{ alignItems: "start" }}>
            <div className="pg-col" style={{ gap: 20 }}>

              <div className="pg-card" style={{ marginBottom: 0, marginTop: 20 }}>
                <div className="pg-card-header"><div className="pg-card-header-left"><div className="pg-card-icon">ℹ️</div><h2 className="pg-card-title">Informazioni</h2></div></div>
                <div style={{ padding: "16px 24px" }}>
                  <div className="pg-info-row"><span className="pg-info-row-label">Partecipanti</span><span className="pg-info-row-value">{participants.length}</span></div>
                  <div className="pg-info-row"><span className="pg-info-row-label">Arbitri</span><span className="pg-info-row-value">{referees.length}</span></div>
                  <div className="pg-info-row"><span className="pg-info-row-label">Creazione</span><span className="pg-info-row-value">{new Date(league.creationDate).toLocaleDateString("it-IT")}</span></div>
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">⚖️</div><h2 className="pg-card-title">Arbitri assegnati</h2></div>
                  <span className="pg-badge pg-badge-yellow">{referees.length}</span>
                </div>
                <div style={{ padding: "12px 24px" }}>
                  {referees.length > 0 ? referees.map(r => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="participant-avatar">{r.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{r.name} {r.surname}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{r.userName}</div>
                      </div>
                    </div>
                  )) : <div className="pg-empty" style={{ padding: "16px 0" }}>Nessun arbitro assegnato</div>}
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">🎖️</div><h2 className="pg-card-title">Assegna arbitro</h2></div>
                </div>
                <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <select className="dark-select" value={selectedRefereeId} onChange={e => setSelectedRefereeId(e.target.value)}>
                    <option value="">Scegli un utente...</option>
                    {allEligibleReferees.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.surname} — {u.userName}
                        {participantIds.has(u.id) ? " (nella lega)" : " (esterno)"}
                      </option>
                    ))}
                  </select>
                  <button
                    className="pg-btn pg-btn-warning"
                    style={{ width: "100%", opacity: selectedRefereeId ? 1 : 0.5 }}
                    onClick={handleSetReferee}
                    disabled={!selectedRefereeId}
                  >
                    ⚖️ Assegna come arbitro
                  </button>
                </div>
              </div>

            </div>

            <div className="pg-col" style={{ gap: 20 }}>

              <div className="pg-card" style={{ marginBottom: 0, marginTop: 20 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">➕</div><h2 className="pg-card-title">Aggiungi partecipante</h2></div>
                  <span className="pg-badge pg-badge-blue">{allUsers.length} disponibili</span>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  {allUsers.length === 0 ? (
                    <div className="pg-empty" style={{ padding: "12px 0" }}>Tutti gli utenti sono già nella lega</div>
                  ) : (
                    <div style={{ display: "flex", gap: 10 }}>
                      <select className="dark-select" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                        <option value="">Seleziona utente...</option>
                        {allUsers.map(u => (
                          <option key={u.id} value={u.id}>{u.name} {u.surname} — {u.userName}</option>
                        ))}
                      </select>
                      <button
                        className="pg-btn pg-btn-primary"
                        style={{ whiteSpace: "nowrap", opacity: selectedUserId ? 1 : 0.5 }}
                        onClick={handleAddParticipant}
                        disabled={!selectedUserId}
                      >
                        + Aggiungi
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">👥</div><h2 className="pg-card-title">Partecipanti</h2></div>
                  <span className="pg-badge pg-badge-blue">{participants.length}</span>
                </div>
                <div style={{ padding: "8px 24px 16px" }}>
                  {participants.length > 0 ? participants.map((u, idx) => (
                    <div key={u.id} className="participant-row">
                      <div className="participant-info" onClick={() => navigate(`/user/${u.id}`)}>
                        <span className={rankClass(idx)}>{idx + 1}</span>
                        <div className="participant-avatar">{u.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{u.name} {u.surname}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{u.userName}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="pg-badge pg-badge-blue">{u.totalPoints} pts</span>
                        <button className="remove-btn" title="Rimuovi dalla lega" onClick={() => handleRemoveParticipant(u.id, `${u.name} ${u.surname}`)}>✕</button>
                      </div>
                    </div>
                  )) : (
                    <div className="pg-empty" style={{ padding: "16px 0" }}>Nessun partecipante</div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default LeagueDataAdminPage;