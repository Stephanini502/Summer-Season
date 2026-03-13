import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { sharedStyles } from "../style/SharedStyles";

function LeagueDataAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [league, setLeague] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRefereeId, setSelectedRefereeId] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [uploadingFor, setUploadingFor] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef();

  const [lightbox, setLightbox] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const refereeRole = "Referee";
  const headers = { Authorization: `Bearer ${token}` };
  const jsonHeaders = { ...headers, "Content-Type": "application/json" };

  const normalizeValues = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };

  const normalizeMedia = (m) => ({
    id: m.id ?? m.Id,
    url: m.url ?? m.Url ?? "",
    type: (m.type ?? m.Type ?? "image").toLowerCase(),
  });

  const normalizeUser = (u) => ({
    id: u.id ?? u.Id,
    name: u.name ?? u.Name ?? "",
    surname: u.surname ?? u.Surname ?? "",
    userName: u.userName ?? u.UserName ?? "",
    roles: Array.isArray(u.roles ?? u.Roles) ? (u.roles ?? u.Roles).map(r => r.toString()) : [],
    totalPoints: u.totalPoints ?? u.TotalPoints ?? 0,
  });

  const normalizeChallenge = (c) => ({
    id: c.id ?? c.Id,
    name: c.name ?? c.Name ?? "",
    description: c.description ?? c.Description ?? "",
    points: c.points ?? c.Points ?? 0,
    media: normalizeValues(c.media ?? c.Media).map(normalizeMedia),
  });

  const normalizeLeague = (l) => ({
    ...l,
    media: normalizeValues(l.media ?? l.Media).map(normalizeMedia),
  });

  const referees = (participants || []).filter(u => userRoles[u.id]?.includes(refereeRole));

  const loadRolesForParticipants = async (users) => {
    const rolesMap = {};
    await Promise.all(users.map(async (u) => {
      try {
        const res = await fetch(`http://localhost:5247/api/users/${u.id}/roles`, { headers });
        if (res.ok) {
          let roles = await res.json();
          if (roles?.$values) roles = roles.$values;
          rolesMap[u.id] = Array.isArray(roles) ? roles.map(r => r.toString()) : [];
        } else { rolesMap[u.id] = []; }
      } catch { rolesMap[u.id] = []; }
    }));
    setUserRoles(rolesMap);
  };

  const fetchLeagueData = async () => {
    setLoading(true); setError("");
    try {
      const [leagueData, participantsData, rankingData, challengesData, mediaData] = await Promise.all([
        fetch(`http://localhost:5247/api/leagues/${id}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/leagues/${id}/participants`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/challenges/${id}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/media/league/${id}`, { headers }).then(r => r.json()),
      ]);

      const normalized = normalizeLeague(leagueData);
      normalized.media = normalizeValues(mediaData).map(normalizeMedia);

      setLeague(normalized);
      setParticipants(normalizeValues(rankingData).map(normalizeUser).sort((a, b) => b.totalPoints - a.totalPoints));
      setChallenges(normalizeValues(challengesData).map(normalizeChallenge));
    } catch (err) {
      setError("Errore caricamento dati lega");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeagueData(); }, [id]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(prev => {
        const next = (prev.index + 1) % prev.allImages.length;
        return { ...prev, url: prev.allImages[next].url, index: next };
      });
      if (e.key === "ArrowLeft") setLightbox(prev => {
        const next = (prev.index - 1 + prev.allImages.length) % prev.allImages.length;
        return { ...prev, url: prev.allImages[next].url, index: next };
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const openLightbox = (images, index) => setLightbox({ url: images[index].url, allImages: images, index });

  const handleDownload = async (url) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = url.split("/").pop().split("?")[0] || "immagine";
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

const refreshParticipantsAndRanking = () => {

  fetch(`http://localhost:5247/api/leagues/${id}/participants`, { headers })
    .then(r => r.json())
    .then(data => {
      const normalized = normalizeValues(data).map(normalizeUser);
      setParticipants(normalized);
      loadRolesForParticipants(normalized);
    })
    .catch(console.error);

  fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers })
    .then(r => r.json())
    .then(data => {
      const normalizedRanking = normalizeValues(data)
        .map(normalizeUser)
        .sort((a, b) => b.totalPoints - a.totalPoints);

      setRanking(normalizedRanking);
    })
    .catch(console.error);
};

  const handleAddParticipant = () => {
    if (!selectedUserId) return;
    fetch(`http://localhost:5247/api/leagues/${id}/participants/${selectedUserId}`, { method: "POST", headers })
      .then(res => { if (!res.ok) throw new Error("Errore aggiunta"); setSelectedUserId(""); refreshParticipantsAndRanking(); })
      .catch(err => alert(err.message));
  };

  const handleRemoveParticipant = async (uid) => {
    if (!window.confirm("Rimuovere questo partecipante?")) return;
    try {
      const res = await fetch(`http://localhost:5247/api/leagues/${id}/${uid}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Errore rimozione");
      refreshParticipantsAndRanking();
    } catch (err) { alert(err.message); }
  };

  const handleSetReferee = () => {
    if (!selectedRefereeId) return;
    fetch(`http://localhost:5247/api/users/${selectedRefereeId}/${refereeRole}`, { method: "PUT", headers })
      .then(res => { if (!res.ok) throw new Error("Errore assegnazione"); setSelectedRefereeId(""); refreshParticipantsAndRanking(); })
      .catch(err => alert(err.message));
  };

  const triggerUpload = (type, entityId, mediaType) => {
    setUploadingFor({ type, id: entityId, mediaType });
    fileInputRef.current.accept = mediaType === "image" ? "image/*" : "video/*";
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingFor) return;
    e.target.value = "";

    const { type, id: entityId, mediaType } = uploadingFor;
    const endpoint = type === "league"
      ? `http://localhost:5247/api/media/league/${entityId}?type=${mediaType}`
      : `http://localhost:5247/api/media/challenge/${entityId}?type=${mediaType}&leagueId=${id}`;

    setUploadProgress(`Caricamento ${mediaType === "image" ? "immagine" : "video"}...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(endpoint, { method: "POST", headers, body: formData });
      if (!uploadRes.ok) throw new Error("Errore upload");
      const { id: mediaId, url, type: mType } = await uploadRes.json();

      const newMedia = { id: mediaId, url, type: mType };

      if (type === "league") {
        setLeague(prev => ({ ...prev, media: [...(prev.media || []), newMedia] }));
      } else {
        setChallenges(prev => prev.map(c =>
          c.id === entityId ? { ...c, media: [...(c.media || []), newMedia] } : c
        ));
      }
    } catch (err) {
      alert("Errore durante il caricamento: " + err.message);
    } finally {
      setUploadProgress(null);
      setUploadingFor(null);
    }
  };

  const handleDeleteMedia = async (mediaId, type, entityId) => {
    if (!window.confirm("Eliminare questo media? L'operazione è irreversibile.")) return;
    try {
      const res = await fetch(`http://localhost:5247/api/media/${mediaId}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Errore eliminazione");
      if (type === "league") {
        setLeague(prev => ({ ...prev, media: prev.media.filter(m => m.id !== mediaId) }));
      } else {
        setChallenges(prev => prev.map(c =>
          c.id === entityId ? { ...c, media: c.media.filter(m => m.id !== mediaId) } : c
        ));
      }
    } catch (err) { alert("Errore eliminazione: " + err.message); }
  };

  const rankClass = (i) => i === 0 ? "pg-rank pg-rank-1" : i === 1 ? "pg-rank pg-rank-2" : i === 2 ? "pg-rank pg-rank-3" : "pg-rank";

  if (loading) return (<><style>{sharedStyles}</style><div className="pg-root"><div className="pg-loading"><div className="pg-spinner" /></div></div></>);
  if (error) return (<><style>{sharedStyles}</style><div className="pg-root"><div className="pg-alert pg-alert-danger">⚠️ {error}</div></div></>);
  if (!league) return (<><style>{sharedStyles}</style><div className="pg-root"><div className="pg-empty">Lega non trovata</div></div></>);

  const leagueImages = (league.media || []).filter(m => m.type === "image");
  const leagueVideos = (league.media || []).filter(m => m.type === "video");

  return (
    <>
      <style>{sharedStyles}
        {`
        .media-thumb { width: 100%; border-radius: 8px; object-fit: cover; max-height: 160px; display: block; cursor: zoom-in; }
        .media-video { width: 100%; border-radius: 8px; max-height: 200px; display: block; }
        .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
        .media-item { position: relative; border-radius: 10px; overflow: hidden; background: var(--bg); border: 1px solid var(--border); }
        .media-item-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.2s;
        }
        .media-item:hover .media-item-overlay { background: rgba(0,0,0,0.45); }
        .media-icon-btn {
          opacity: 0; transition: opacity 0.2s;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none; font-size: 1rem;
          backdrop-filter: blur(4px);
        }
        .media-item:hover .media-icon-btn { opacity: 1; }
        .media-icon-btn-view { background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.45) !important; }
        .media-icon-btn-dl   { background: #3b82f6; }
        .media-icon-btn-del  { background: #ef4444; }
        .media-upload-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
          cursor: pointer; border: 1px dashed var(--border);
          background: var(--bg); color: var(--text-muted); transition: all 0.15s;
        }
        .media-upload-btn:hover { border-color: var(--sun); color: var(--sun-dark); background: var(--sun-light); }
        .media-section { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }
        .media-block-title { font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
        .media-progress { font-size: 0.75rem; color: var(--sun-dark); font-weight: 600; background: var(--sun-light); padding: 6px 14px; border-radius: 20px; }
        .challenge-item { border-bottom: 1px solid var(--border); }
        .challenge-media-wrap { padding: 8px 16px 16px; background: #fafbff; }
        .video-wrap { position: relative; }
        .video-actions { position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; }
        .video-icon-btn {
          width: 32px; height: 32px; border-radius: 50%; border: none;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; cursor: pointer;
        }

        /* Lightbox */
        .lb-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.92); display: flex;
          align-items: center; justify-content: center;
          animation: lbFadeIn 0.15s ease;
        }
        @keyframes lbFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .lb-img {
          max-width: 90vw; max-height: 85vh;
          border-radius: 10px; object-fit: contain;
          box-shadow: 0 25px 60px rgba(0,0,0,0.6);
          animation: lbZoomIn 0.18s ease;
        }
        @keyframes lbZoomIn { from { transform: scale(0.93); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .lb-close {
          position: fixed; top: 20px; right: 24px;
          background: rgba(255,255,255,0.15); border: none; color: white;
          font-size: 1.4rem; width: 44px; height: 44px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s; backdrop-filter: blur(6px);
        }
        .lb-close:hover { background: rgba(255,255,255,0.28); }
        .lb-download {
          position: fixed; top: 20px; right: 76px;
          background: #3b82f6; border: none; color: white;
          font-size: 0.8rem; font-weight: 700; padding: 0 16px; height: 44px;
          border-radius: 22px; cursor: pointer; display: flex; align-items: center; gap: 6px;
          transition: background 0.15s;
        }
        .lb-download:hover { background: #2563eb; }
        .lb-arrow {
          position: fixed; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.15); border: none; color: white;
          font-size: 1.6rem; width: 48px; height: 48px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.15s; backdrop-filter: blur(6px);
        }
        .lb-arrow:hover { background: rgba(255,255,255,0.28); }
        .lb-arrow-left { left: 20px; }
        .lb-arrow-right { right: 20px; }
        .lb-counter {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          color: rgba(255,255,255,0.6); font-size: 0.8rem; font-weight: 600;
          background: rgba(0,0,0,0.4); padding: 4px 14px; border-radius: 20px;
        }
        `}
      </style>

      {lightbox && (
        <div className="lb-backdrop" onClick={() => setLightbox(null)}>
          <img src={lightbox.url} className="lb-img" onClick={e => e.stopPropagation()} alt="anteprima" />
          <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lb-download" onClick={e => { e.stopPropagation(); handleDownload(lightbox.url); }}>⬇ Scarica</button>
          {lightbox.allImages.length > 1 && (
            <>
              <button className="lb-arrow lb-arrow-left" onClick={e => { e.stopPropagation(); setLightbox(prev => { const next = (prev.index - 1 + prev.allImages.length) % prev.allImages.length; return { ...prev, url: prev.allImages[next].url, index: next }; }); }}>‹</button>
              <button className="lb-arrow lb-arrow-right" onClick={e => { e.stopPropagation(); setLightbox(prev => { const next = (prev.index + 1) % prev.allImages.length; return { ...prev, url: prev.allImages[next].url, index: next }; }); }}>›</button>
              <div className="lb-counter">{lightbox.index + 1} / {lightbox.allImages.length}</div>
            </>
          )}
        </div>
      )}

      <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />

      <div className="pg-root">
        <div className="pg-content">

          <div className="pg-hero">
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>
                Admin · Gestione Lega
              </p>
              <h1 className="pg-hero-title">{league.name}</h1>
              <p className="pg-hero-sub">Creata il {new Date(league.creationDate).toLocaleDateString("it-IT")}</p>
            </div>
            <button className="pg-btn-hero" onClick={() => navigate("/challenges")}>🏁 Vai alle sfide</button>
          </div>

          <div className="pg-stats">
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Partecipanti</p><p className="pg-stat-value">{participants.length}</p></div>
              <div className="pg-stat-icon">👥</div>
            </div>
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Arbitri</p><p className="pg-stat-value">{referees.length}</p></div>
              <div className="pg-stat-icon pg-stat-icon-yellow">🟡</div>
            </div>
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Sfide</p><p className="pg-stat-value">{challenges.length}</p></div>
              <div className="pg-stat-icon">🏁</div>
            </div>
            <div className="pg-stat-card">
              <div><p className="pg-stat-label">Media caricati</p><p className="pg-stat-value">{(league.media || []).length}</p></div>
              <div className="pg-stat-icon">🖼️</div>
            </div>
          </div>

          <div className="pg-card" style={{ marginBottom: 0 }}>
            <div className="pg-card-header">
              <div className="pg-card-header-left">
                <div className="pg-card-icon">🖼️</div>
                <h2 className="pg-card-title">Media della lega</h2>
              </div>
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
                          <button className="media-icon-btn media-icon-btn-view" title="Apri" onClick={() => openLightbox(leagueImages, idx)}>🔍</button>
                          <button className="media-icon-btn media-icon-btn-dl" title="Scarica" onClick={() => handleDownload(m.url)}>⬇️</button>
                          <button className="media-icon-btn media-icon-btn-del" title="Elimina" onClick={() => handleDeleteMedia(m.id, "league", league.id)}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="media-upload-btn" onClick={() => triggerUpload("league", league.id, "image")}>
                  📷 {leagueImages.length > 0 ? "Aggiungi immagine" : "Carica immagine"}
                </button>
              </div>

              <div>
                <p className="media-block-title">🎬 Video ({leagueVideos.length})</p>
                {leagueVideos.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
                    {leagueVideos.map(m => (
                      <div key={m.id} className="video-wrap media-item" style={{ padding: 6 }}>
                        <video src={m.url} controls className="media-video" />
                        <div className="video-actions">
                          <button className="video-icon-btn" title="Scarica" onClick={() => handleDownload(m.url)} style={{ background: "#3b82f6" }}>⬇️</button>
                          <button className="video-icon-btn" title="Elimina" onClick={() => handleDeleteMedia(m.id, "league", league.id)} style={{ background: "#ef4444" }}>🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="media-upload-btn" onClick={() => triggerUpload("league", league.id, "video")}>
                  🎬 {leagueVideos.length > 0 ? "Aggiungi video" : "Carica video"}
                </button>
              </div>
            </div>
          </div>

          {challenges.length > 0 && (
            <div className="pg-card" style={{ marginBottom: 0 }}>
              <div className="pg-card-header">
                <div className="pg-card-header-left">
                  <div className="pg-card-icon">🏁</div>
                  <h2 className="pg-card-title">Media delle sfide</h2>
                </div>
                <span className="pg-badge pg-badge-sun">{challenges.length} sfide</span>
              </div>

              {challenges.map(c => {
                const cImages = (c.media || []).filter(m => m.type === "image");
                const cVideos = (c.media || []).filter(m => m.type === "video");
                return (
                  <div key={c.id} className="challenge-item">
                    <div className="pg-list-item" style={{ borderBottom: "none" }}>
                      <div>
                        <div className="pg-list-item-name">{c.name}</div>
                        <div className="pg-list-item-sub">{c.description}</div>
                      </div>
                      <span className="pg-badge pg-badge-green">+{c.points} pts</span>
                    </div>

                    <div className="challenge-media-wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <p className="media-block-title">📷 Immagini ({cImages.length})</p>
                        {cImages.length > 0 && (
                          <div className="media-grid" style={{ marginBottom: 8 }}>
                            {cImages.map((m, idx) => (
                              <div key={m.id} className="media-item">
                                <img src={m.url} alt={c.name} className="media-thumb" style={{ maxHeight: 110 }} onClick={() => openLightbox(cImages, idx)} />
                                <div className="media-item-overlay">
                                  <button className="media-icon-btn media-icon-btn-view" title="Apri" onClick={() => openLightbox(cImages, idx)}>🔍</button>
                                  <button className="media-icon-btn media-icon-btn-dl" title="Scarica" onClick={() => handleDownload(m.url)}>⬇️</button>
                                  <button className="media-icon-btn media-icon-btn-del" title="Elimina" onClick={() => handleDeleteMedia(m.id, "challenge", c.id)}>🗑️</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <button className="media-upload-btn" onClick={() => triggerUpload("challenge", c.id, "image")}>
                          📷 {cImages.length > 0 ? "Aggiungi" : "Carica immagine"}
                        </button>
                      </div>

                      <div>
                        <p className="media-block-title">🎬 Video ({cVideos.length})</p>
                        {cVideos.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
                            {cVideos.map(m => (
                              <div key={m.id} className="video-wrap media-item" style={{ padding: 4 }}>
                                <video src={m.url} controls className="media-video" style={{ maxHeight: 130 }} />
                                <div className="video-actions">
                                  <button className="video-icon-btn" title="Scarica" onClick={() => handleDownload(m.url)} style={{ background: "#3b82f6" }}>⬇️</button>
                                  <button className="video-icon-btn" title="Elimina" onClick={() => handleDeleteMedia(m.id, "challenge", c.id)} style={{ background: "#ef4444" }}>🗑️</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <button className="media-upload-btn" onClick={() => triggerUpload("challenge", c.id, "video")}>
                          🎬 {cVideos.length > 0 ? "Aggiungi" : "Carica video"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="pg-grid-sidebar" style={{ alignItems: "start" }}>

            <div className="pg-col" style={{ gap: 20 }}>
              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">ℹ️</div><h2 className="pg-card-title">Informazioni</h2></div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <div className="pg-info-row">
                    <span className="pg-info-row-label">Partecipanti</span>
                    <span className="pg-info-row-value">{participants.length}</span>
                  </div>
                  <div className="pg-info-row">
                    <span className="pg-info-row-label">Creazione</span>
                    <span className="pg-info-row-value">{new Date(league.creationDate).toLocaleDateString("it-IT")}</span>
                  </div>
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">🟡</div><h2 className="pg-card-title">Arbitri assegnati</h2></div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  {referees.length > 0 ? referees.map(r => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div className="pg-avatar" style={{ width: 36, height: 36, fontSize: "0.9rem", margin: 0 }}>{r.name[0]}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{r.name} {r.surname}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{r.userName}</div>
                      </div>
                    </div>
                  )) : <div className="pg-empty" style={{ padding: "16px 0" }}>Nessun arbitro assegnato</div>}
                </div>
              </div>

              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">⚖️</div><h2 className="pg-card-title">Assegna arbitro</h2></div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <div className="pg-field">
                    <label className="pg-field-label">Seleziona partecipante</label>
                    <select className="pg-select" value={selectedRefereeId} onChange={e => setSelectedRefereeId(e.target.value)}>
                      <option value="">Scegli...</option>
                      {(participants || []).map(u => (
                        <option key={u.id} value={u.id}>{u.name} {u.surname} ({u.userName})</option>
                      ))}
                    </select>
                  </div>
                  <button className="pg-btn pg-btn-warning" style={{ width: "100%" }} onClick={handleSetReferee}>⚖️ Assegna come arbitro</button>
                </div>
              </div>
            </div>

            <div className="pg-col" style={{ gap: 20 }}>
              <div className="pg-card" style={{ marginBottom: 0 }}>
                <div className="pg-card-header">
                  <div className="pg-card-header-left"><div className="pg-card-icon">➕</div><h2 className="pg-card-title">Aggiungi partecipante</h2></div>
                </div>
                <div style={{ padding: "16px 24px" }}>
                  <div className="pg-inline-form">
                    <select className="pg-select" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                      <option value="">Seleziona utente...</option>
                      {(allUsers || []).map(u => (
                        <option key={u.id} value={u.id}>{u.name} {u.surname} ({u.userName})</option>
                      ))}
                    </select>
                    <button className="pg-btn pg-btn-primary" onClick={handleAddParticipant}>Aggiungi</button>
                  </div>
                </div>
              </div>

              
              <div className="pg-card" style={{ marginBottom: 0 }}>
              <div className="pg-card-header">
                <div className="pg-card-header-left">
                  <div className="pg-card-icon">👥</div>
                  <h2 className="pg-card-title">Classifica partecipanti</h2>
                </div>
              </div>
              <ul className="pg-list">
                {participants.length > 0 ? participants.map((u, idx) => (
                  <li key={u.id} className="pg-list-item clickable" onClick={() => navigate(`/user/${u.id}`)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className={rankClass(idx)}>{idx + 1}</span>
                      <div>
                        <div className="pg-list-item-name">{u.name} {u.surname}</div>
                        <div className="pg-list-item-sub">{u.userName}</div>
                      </div>
                    </div>
                    <span className="pg-badge pg-badge-blue">{u.totalPoints} pts</span>
                  </li>
                )) : (
                  <li><div className="pg-empty">Nessun partecipante</div></li>
                )}
              </ul>
            </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default LeagueDataAdminPage;