import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { sharedStyles } from "../style/SharedStyles";

const mediaStyles = `
  .media-thumb { width: 100%; border-radius: 10px; object-fit: cover; max-height: 200px; display: block; cursor: zoom-in; }
  .media-video { width: 100%; border-radius: 10px; max-height: 220px; display: block; background: #0d1117; }
  .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
  .media-item {
    position: relative; border-radius: 10px; overflow: hidden;
    background: #121826 !important;
    border: 1px solid rgba(255,255,255,0.07) !important;
  }
  .media-item-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0);
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: background 0.2s;
  }
  .media-item:hover .media-item-overlay { background: rgba(0,0,0,0.55); }
  .media-icon-btn {
    opacity: 0; transition: opacity 0.2s;
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; border: none; font-size: 1rem; backdrop-filter: blur(4px);
  }
  .media-item:hover .media-icon-btn { opacity: 1; }
  .media-icon-btn-view { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.35) !important; }
  .media-icon-btn-dl   { background: #3b82f6; }
  .media-upload-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
    cursor: pointer;
    border: 1px dashed rgba(255,255,255,0.12) !important;
    background: rgba(255,255,255,0.03) !important;
    color: #8b97b8 !important; transition: all 0.15s;
  }
  .media-upload-btn:hover {
    border-color: rgba(251,191,36,0.4) !important;
    color: #fbbf24 !important;
    background: rgba(251,191,36,0.08) !important;
  }
  .media-section { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; gap: 16px; }
  .media-block-title { font-size: 0.72rem; font-weight: 700; color: #8b97b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
  .media-progress { font-size: 0.75rem; color: #fbbf24; font-weight: 600; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.2); padding: 6px 14px; border-radius: 20px; }
  .challenge-item { border-bottom: 1px solid rgba(255,255,255,0.07); }
  .challenge-media-wrap {
    padding: 8px 16px 16px;
    background: rgba(255,255,255,0.015) !important;
    border-top: 1px dashed rgba(255,255,255,0.06);
  }
  .video-wrap { position: relative; }
  .video-actions { position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; }
  .video-icon-btn { width: 32px; height: 32px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; cursor: pointer; }
  .lb-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.94); display: flex; align-items: center; justify-content: center; animation: lbFadeIn 0.15s ease; }
  @keyframes lbFadeIn { from { opacity:0 } to { opacity:1 } }
  .lb-img { max-width: 90vw; max-height: 85vh; border-radius: 10px; object-fit: contain; box-shadow: 0 25px 60px rgba(0,0,0,0.7); animation: lbZoomIn 0.18s ease; }
  @keyframes lbZoomIn { from { transform:scale(0.93); opacity:0 } to { transform:scale(1); opacity:1 } }
  .lb-close { position: fixed; top: 20px; right: 24px; background: rgba(255,255,255,0.12); border: none; color: white; font-size: 1.4rem; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; backdrop-filter: blur(6px); }
  .lb-close:hover { background: rgba(255,255,255,0.22); }
  .lb-download { position: fixed; top: 20px; right: 76px; background: #3b82f6; border: none; color: white; font-size: 0.8rem; font-weight: 700; padding: 0 16px; height: 44px; border-radius: 22px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.15s; }
  .lb-download:hover { background: #2563eb; }
  .lb-arrow { position: fixed; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.12); border: none; color: white; font-size: 1.6rem; width: 48px; height: 48px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; backdrop-filter: blur(6px); }
  .lb-arrow:hover { background: rgba(255,255,255,0.22); }
  .lb-arrow-left { left: 20px; } .lb-arrow-right { right: 20px; }
  .lb-counter { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.5); font-size: 0.8rem; font-weight: 600; background: rgba(0,0,0,0.5); padding: 4px 14px; border-radius: 20px; }
`;

function LeagueDataPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [league, setLeague] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingFor, setUploadingFor] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef();
  const [lightbox, setLightbox] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const headers = { Authorization: `Bearer ${token}` };

  const normalizeValues = (d) => { if (!d) return []; if (Array.isArray(d)) return d; if (d.$values) return d.$values; return [d]; };
  const normalizeMedia  = (m) => ({ id: m.id??m.Id, url: m.url??m.Url??"", type: (m.type??m.Type??"image").toLowerCase() });
  const normalizeUser   = (u) => ({ id: u.id??u.Id, name: u.name??u.Name??"", surname: u.surname??u.Surname??"", userName: u.userName??u.UserName??"", totalPoints: u.totalPoints??u.TotalPoints??0 });
  const normalizeChallenge = (c) => ({ id: c.id??c.Id, name: c.name??c.Name??"", description: c.description??c.Description??"", points: c.points??c.Points??0, media: normalizeValues(c.media??c.Media).map(normalizeMedia) });
  const normalizeLeague = (l) => ({ ...l, media: normalizeValues(l.media??l.Media).map(normalizeMedia) });

  const fetchLeagueData = async () => {
    setLoading(true); setError("");
    try {
      const [leagueData, rankingData, challengesData, mediaData] = await Promise.all([
        fetch(`http://localhost:5247/api/leagues/${id}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/challenges/${id}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/media/league/${id}`, { headers }).then(r => r.json()),
      ]);
      const normalized = normalizeLeague(leagueData);
      normalized.media = normalizeValues(mediaData).map(normalizeMedia);
      setLeague(normalized);
      setParticipants(normalizeValues(rankingData).map(normalizeUser).sort((a,b) => b.totalPoints - a.totalPoints));
      setChallenges(normalizeValues(challengesData).map(normalizeChallenge));
    } catch { setError("Errore caricamento dati lega"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeagueData(); }, [id]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(p => { const n=(p.index+1)%p.allImages.length; return {...p,url:p.allImages[n].url,index:n}; });
      if (e.key === "ArrowLeft")  setLightbox(p => { const n=(p.index-1+p.allImages.length)%p.allImages.length; return {...p,url:p.allImages[n].url,index:n}; });
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
      const r = await fetch(endpoint, { method: "POST", headers, body: fd });
      if (!r.ok) throw new Error("Errore upload");
      const { id: mid, url, type: mt } = await r.json();
      const nm = { id: mid, url, type: mt };
      if (type === "league") setLeague(p => ({ ...p, media: [...(p.media||[]), nm] }));
      else setChallenges(p => p.map(c => c.id === entityId ? { ...c, media: [...(c.media||[]), nm] } : c));
    } catch (err) { alert("Errore: " + err.message); }
    finally { setUploadProgress(null); setUploadingFor(null); }
  };

  if (loading) return (<><style>{sharedStyles}{mediaStyles}</style><div className="pg-root"><div className="pg-loading"><div className="pg-spinner"/></div></div></>);
  if (error)   return (<><style>{sharedStyles}{mediaStyles}</style><div className="pg-root"><div className="pg-alert pg-alert-danger">⚠️ {error}</div></div></>);
  if (!league) return (<><style>{sharedStyles}{mediaStyles}</style><div className="pg-root"><div className="pg-empty">Lega non trovata</div></div></>);

  const topPlayer = participants[0] ?? null;
  const totalPts  = challenges.reduce((s,c) => s + (c.points||0), 0);
  const rankClass = (i) => i===0?"pg-rank pg-rank-1":i===1?"pg-rank pg-rank-2":i===2?"pg-rank pg-rank-3":"pg-rank";
  const leagueImages = (league.media||[]).filter(m => m.type==="image");
  const leagueVideos = (league.media||[]).filter(m => m.type==="video");

  return (
    <>
      <style>{sharedStyles}{mediaStyles}</style>

      {lightbox && (
        <div className="lb-backdrop" onClick={() => setLightbox(null)}>
          <img src={lightbox.url} className="lb-img" onClick={e=>e.stopPropagation()} alt="anteprima"/>
          <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lb-download" onClick={e=>{e.stopPropagation();handleDownload(lightbox.url);}}>⬇ Scarica</button>
          {lightbox.allImages.length > 1 && (<>
            <button className="lb-arrow lb-arrow-left"  onClick={e=>{e.stopPropagation();setLightbox(p=>{const n=(p.index-1+p.allImages.length)%p.allImages.length;return{...p,url:p.allImages[n].url,index:n};});}}>‹</button>
            <button className="lb-arrow lb-arrow-right" onClick={e=>{e.stopPropagation();setLightbox(p=>{const n=(p.index+1)%p.allImages.length;return{...p,url:p.allImages[n].url,index:n};});}}>›</button>
            <div className="lb-counter">{lightbox.index+1} / {lightbox.allImages.length}</div>
          </>)}
        </div>
      )}

      <input ref={fileInputRef} type="file" style={{display:"none"}} onChange={handleFileChange}/>

      <div className="pg-root">
        <div className="pg-content">

          <div className="pg-hero">
            <div>
              <p className="pg-hero-eyebrow">Pagina Lega</p>
              <h1 className="pg-hero-title">{league.name}</h1>
              <p className="pg-hero-sub">Creata il {new Date(league.creationDate).toLocaleDateString("it-IT")}</p>
            </div>
            <button className="pg-btn-hero" onClick={() => navigate("/challenges")}>🏁 Vai alle sfide</button>
          </div>

          <div className="pg-stats">
            <div className="pg-stat-card"><div><p className="pg-stat-label">Partecipanti</p><p className="pg-stat-value">{participants.length}</p></div><div className="pg-stat-icon">👥</div></div>
            <div className="pg-stat-card"><div><p className="pg-stat-label">Sfide</p><p className="pg-stat-value">{challenges.length}</p></div><div className="pg-stat-icon">🏁</div></div>
            <div className="pg-stat-card"><div><p className="pg-stat-label">Punti ottenibili</p><p className="pg-stat-value">{totalPts}</p></div><div className="pg-stat-icon pg-stat-icon-sun">⭐</div></div>
            {topPlayer && (
              <div className="pg-stat-card">
                <div><p className="pg-stat-label">Leader attuale</p><p className="pg-stat-value-sm">{topPlayer.name} {topPlayer.surname}</p><p className="pg-stat-sub">{topPlayer.userName} · {topPlayer.totalPoints} pts</p></div>
                <div className="pg-stat-icon pg-stat-icon-yellow">🥇</div>
              </div>
            )}
          </div>

          {/* MEDIA LEGA */}
          <div className="pg-card" style={{marginBottom:0}}>
            <div className="pg-card-header">
              <div className="pg-card-header-left"><div className="pg-card-icon">🖼️</div><h2 className="pg-card-title">Media della lega</h2></div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {uploadProgress && <span className="media-progress">⏳ {uploadProgress}</span>}
                <span className="pg-badge pg-badge-blue">{(league.media||[]).length} file</span>
              </div>
            </div>
            <div className="media-section">
              <div>
                <p className="media-block-title">📷 Immagini ({leagueImages.length})</p>
                {leagueImages.length > 0 && (
                  <div className="media-grid" style={{marginBottom:10}}>
                    {leagueImages.map((m,idx) => (
                      <div key={m.id} className="media-item">
                        <img src={m.url} alt="" className="media-thumb" onClick={()=>openLightbox(leagueImages,idx)}/>
                        <div className="media-item-overlay">
                          <button className="media-icon-btn media-icon-btn-view" onClick={()=>openLightbox(leagueImages,idx)}>🔍</button>
                          <button className="media-icon-btn media-icon-btn-dl"   onClick={()=>handleDownload(m.url)}>⬇️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="media-upload-btn" onClick={()=>triggerUpload("league",league.id,"image")}>📷 {leagueImages.length>0?"Aggiungi altra immagine":"Carica immagine"}</button>
              </div>
              <div>
                <p className="media-block-title">🎬 Video ({leagueVideos.length})</p>
                {leagueVideos.length > 0 && (
                  <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:10}}>
                    {leagueVideos.map(m => (
                      <div key={m.id} className="video-wrap media-item" style={{padding:6}}>
                        <video src={m.url} controls className="media-video"/>
                        <div className="video-actions"><button className="video-icon-btn" onClick={()=>handleDownload(m.url)} style={{background:"#3b82f6"}}>⬇️</button></div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="media-upload-btn" onClick={()=>triggerUpload("league",league.id,"video")}>🎬 {leagueVideos.length>0?"Aggiungi altro video":"Carica video"}</button>
              </div>
            </div>
          </div>

          <div className="pg-grid-2">
            {/* Classifica */}
            <div className="pg-card" style={{marginBottom:0}}>
              <div className="pg-card-header"><div className="pg-card-header-left"><div className="pg-card-icon">👥</div><h2 className="pg-card-title">Classifica partecipanti</h2></div></div>
              <ul className="pg-list">
                {participants.length > 0 ? participants.map((u,idx) => (
                  <li key={u.id} className="pg-list-item clickable" onClick={()=>navigate(`/user/${u.id}`)}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <span className={rankClass(idx)}>{idx+1}</span>
                      <div><div className="pg-list-item-name">{u.name} {u.surname}</div><div className="pg-list-item-sub">{u.userName}</div></div>
                    </div>
                    <span className="pg-badge pg-badge-blue">{u.totalPoints} pts</span>
                  </li>
                )) : (<li><div className="pg-empty">Nessun partecipante</div></li>)}
              </ul>
            </div>

            {/* Sfide + media */}
            <div className="pg-card" style={{marginBottom:0}}>
              <div className="pg-card-header">
                <div className="pg-card-header-left"><div className="pg-card-icon">🏁</div><h2 className="pg-card-title">Sfide di questa lega</h2></div>
                {challenges.length>0 && <span className="pg-badge pg-badge-sun">{challenges.length} sfide</span>}
              </div>
              {challenges.length === 0 ? (
                <div className="pg-empty" style={{padding:"32px 0"}}><div style={{fontSize:"1.8rem",marginBottom:8}}>🏝️</div><p>Nessuna sfida assegnata</p></div>
              ) : (
                <ul style={{padding:0,margin:0}}>
                  {challenges.map(c => {
                    const ci = (c.media||[]).filter(m=>m.type==="image");
                    const cv = (c.media||[]).filter(m=>m.type==="video");
                    return (
                      <li key={c.id} className="challenge-item" style={{listStyle:"none"}}>
                        <div className="pg-list-item" style={{borderBottom:"none"}}>
                          <div><div className="pg-list-item-name">{c.name}</div><div className="pg-list-item-sub">{c.description}</div></div>
                          <span className="pg-badge pg-badge-green">+{c.points} pts</span>
                        </div>
                        <div className="challenge-media-wrap">
                          {ci.length > 0 && (
                            <div className="media-grid" style={{marginBottom:8}}>
                              {ci.map((m,idx) => (
                                <div key={m.id} className="media-item">
                                  <img src={m.url} alt={c.name} className="media-thumb" style={{maxHeight:120}} onClick={()=>openLightbox(ci,idx)}/>
                                  <div className="media-item-overlay">
                                    <button className="media-icon-btn media-icon-btn-view" onClick={()=>openLightbox(ci,idx)}>🔍</button>
                                    <button className="media-icon-btn media-icon-btn-dl"   onClick={()=>handleDownload(m.url)}>⬇️</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {cv.length > 0 && (
                            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:8}}>
                              {cv.map(m => (
                                <div key={m.id} className="video-wrap media-item" style={{padding:4}}>
                                  <video src={m.url} controls className="media-video" style={{maxHeight:150}}/>
                                  <div className="video-actions"><button className="video-icon-btn" onClick={()=>handleDownload(m.url)} style={{background:"#3b82f6"}}>⬇️</button></div>
                                </div>
                              ))}
                            </div>
                          )}
                          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                            <button className="media-upload-btn" onClick={()=>triggerUpload("challenge",c.id,"image")}>📷 {ci.length>0?"Aggiungi immagine":"Carica immagine"}</button>
                            <button className="media-upload-btn" onClick={()=>triggerUpload("challenge",c.id,"video")}>🎬 {cv.length>0?"Aggiungi video":"Carica video"}</button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default LeagueDataPage;