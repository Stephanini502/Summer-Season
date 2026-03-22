import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { sharedStyles } from "../style/SharedStyles";
import { mediaStyles } from "../style/SharedStyles";
import ChatRoom from "../components/ChatRoom";

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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchLeagueData();
  }, [id]);

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

          {/* HERO */}
          <div className="pg-hero">
            <div>
              <p className="pg-hero-eyebrow">Pagina Lega</p>
              <h1 className="pg-hero-title">{league.name}</h1>
              <p className="pg-hero-sub">Creata il {new Date(league.creationDate).toLocaleDateString("it-IT")}</p>
            </div>
            <button className="pg-btn-hero" onClick={() => navigate("/challenges")}>🏁 Vai alle sfide</button>
          </div>

          {/* STATS */}
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

          {/* CLASSIFICA + SFIDE */}
          <div className="pg-grid-2">
            <div className="pg-card" style={{marginBottom:0}}>
              <div className="pg-card-header">
                <div className="pg-card-header-left"><div className="pg-card-icon">👥</div><h2 className="pg-card-title">Classifica partecipanti</h2></div>
              </div>
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
                        {ci.length > 0 && (
                          <div className="media-grid" style={{marginBottom:8, padding:"0 16px"}}>
                            {ci.map((m,idx) => (
                              <div key={m.id} className="media-item">
                                <img src={m.url} alt={c.name} className="media-thumb" style={{maxHeight:120}} onClick={()=>openLightbox(ci,idx)}/>
                                <div className="media-item-overlay">
                                  <button className="media-icon-btn media-icon-btn-view" onClick={()=>openLightbox(ci,idx)}>🔍</button>
                                  <button className="media-icon-btn media-icon-btn-dl" onClick={()=>handleDownload(m.url)}>⬇️</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {cv.length > 0 && (
                          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:8,padding:"0 16px"}}>
                            {cv.map(m => (
                              <div key={m.id} className="video-wrap media-item" style={{padding:4}}>
                                <video src={m.url} controls className="media-video" style={{maxHeight:150}}/>
                                <div className="video-actions"><button className="video-icon-btn" onClick={()=>handleDownload(m.url)} style={{background:"#3b82f6"}}>⬇️</button></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* CHAT + MEDIA */}
          <div className="pg-grid-2" style={{ marginTop: 20 }}>

            <div className="pg-card" style={{marginBottom:0}}>
              <div className="pg-card-header">
                <div className="pg-card-header-left">
                  <div className="pg-card-icon">💬</div>
                  <h2 className="pg-card-title">Chat della lega</h2>
                </div>
                <span className="pg-badge pg-badge-blue">{participants.length} partecipanti</span>
              </div>
              <div style={{ padding: "16px" }}>
                <ChatRoom leagueId={id} roomType="league" />
              </div>
            </div>

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
                            <button className="media-icon-btn media-icon-btn-dl" onClick={()=>handleDownload(m.url)}>⬇️</button>
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

          </div>

        </div>
      </div>
    </>
  );
}

export default LeagueDataPage;