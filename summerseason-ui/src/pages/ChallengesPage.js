import { useEffect, useState } from "react";
import { sharedStyles } from "../style/SharedStyles";

const challengesPageStyles = `
  .pg-challenge-card { background: #1a2236 !important; border-color: rgba(255,255,255,0.07) !important; }
  .pg-challenge-card:hover { border-color: rgba(255,255,255,0.13) !important; box-shadow: 0 8px 28px rgba(0,0,0,0.5), 0 0 20px rgba(96,165,250,0.08) !important; }
  .challenges-hero {
    background: linear-gradient(130deg, #0c1428 0%, #0f1f3d 55%, #131f3a 100%);
    border: 1px solid rgba(96,165,250,0.12); border-radius: 14px; padding: 28px 32px;
    margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between;
    gap: 20px; flex-wrap: wrap; position: relative; overflow: hidden;
    animation: pgFadeDown 0.45s ease both;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .challenges-hero::after { content:'🏁'; position:absolute; right:32px; top:50%; transform:translateY(-50%); font-size:4.5rem; opacity:0.06; pointer-events:none; }

  /* Badge completata */
  .challenge-success-badge {
    display:inline-flex; align-items:center; gap:6px; padding:8px 14px;
    background:rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.25);
    color:#fbbf24; border-radius:20px; font-size:0.75rem; font-weight:700;
    animation: successPop 0.25s ease both;
  }
  @keyframes successPop { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

  .challenges-count-bar { display:flex; align-items:center; gap:10px; margin-bottom:20px; animation:pgFadeUp 0.4s ease 0.15s both; }
  .challenges-count-label { font-size:0.72rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#8b97b8; }
  .challenges-count-line { flex:1; height:1px; background:rgba(255,255,255,0.06); }

  /* ── MODAL ── */
  .cm-backdrop {
    position:fixed; inset:0; z-index:200;
    background:rgba(0,0,0,0.72); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center; padding:20px;
    animation:cmFadeIn 0.18s ease;
  }
  @keyframes cmFadeIn { from{opacity:0} to{opacity:1} }
  .cm-box {
    background:#1a2236; border:1px solid rgba(255,255,255,0.1); border-radius:18px;
    width:100%; max-width:500px; max-height:88vh; overflow-y:auto;
    box-shadow:0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);
    animation:cmSlideUp 0.22s ease;
  }
  @keyframes cmSlideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
  .cm-box::-webkit-scrollbar{width:4px} .cm-box::-webkit-scrollbar-track{background:rgba(255,255,255,0.03)} .cm-box::-webkit-scrollbar-thumb{background:rgba(251,191,36,0.3);border-radius:4px}
  .cm-header { padding:22px 24px 16px; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
  .cm-title { font-family:'Outfit',sans-serif; font-size:1.05rem; font-weight:800; color:#eef2ff; letter-spacing:-0.01em; }
  .cm-subtitle { font-size:0.78rem; color:#8b97b8; margin-top:3px; }
  .cm-close { width:30px; height:30px; border-radius:8px; border:none; background:rgba(255,255,255,0.06); color:#8b97b8; font-size:1rem; cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:background 0.15s,color 0.15s; }
  .cm-close:hover { background:rgba(248,113,113,0.15); color:#f87171; }
  .cm-body { padding:16px 24px; }
  .cm-challenge-info { background:rgba(96,165,250,0.07); border:1px solid rgba(96,165,250,0.18); border-radius:10px; padding:12px 16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
  .cm-challenge-name { font-weight:700; font-size:0.9rem; color:#eef2ff; }
  .cm-challenge-league { font-size:0.72rem; color:#8b97b8; margin-top:2px; }
  .cm-section-label { font-size:0.68rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
  .cm-section-label-bonus{color:#34d399} .cm-section-label-malus{color:#f87171}
  .cm-modifier { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.02); cursor:pointer; margin-bottom:7px; transition:all 0.15s; user-select:none; }
  .cm-modifier:last-child{margin-bottom:0}
  .cm-modifier.selected-bonus{border-color:rgba(52,211,153,0.35);background:rgba(52,211,153,0.07)}
  .cm-modifier.selected-malus{border-color:rgba(248,113,113,0.35);background:rgba(248,113,113,0.07)}
  .cm-modifier-check { width:18px; height:18px; border-radius:5px; flex-shrink:0; border:1.5px solid rgba(255,255,255,0.15); background:transparent; display:flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:800; transition:all 0.15s; }
  .selected-bonus .cm-modifier-check{background:#34d399;border-color:#34d399;color:#0d1117}
  .selected-malus .cm-modifier-check{background:#f87171;border-color:#f87171;color:#0d1117}
  .cm-modifier-name{font-size:0.83rem;font-weight:600;color:#eef2ff;flex:1}
  .cm-modifier-desc{font-size:0.72rem;color:#8b97b8;margin-top:1px}
  .cm-divider{height:1px;background:rgba(255,255,255,0.06);margin:18px 0}
  .cm-empty-mods{font-size:0.78rem;color:#4b5675;padding:6px 0;font-style:italic}
  .cm-total { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; margin-top:18px; }
  .cm-total-label{font-size:0.78rem;font-weight:600;color:#8b97b8;text-transform:uppercase;letter-spacing:0.08em}
  .cm-total-value{font-family:'Outfit',sans-serif;font-size:1.6rem;font-weight:800;letter-spacing:-0.03em;line-height:1}
  .cm-total-value.positive{color:#60a5fa;text-shadow:0 0 20px rgba(96,165,250,0.4)}
  .cm-total-value.negative{color:#f87171}
  .cm-total-value.zero{color:#8b97b8}
  .cm-total-breakdown{font-size:0.72rem;color:#8b97b8;margin-top:3px;display:flex;flex-wrap:wrap;gap:4px}
  .cm-total-breakdown span{padding:1px 6px;border-radius:6px}
  .bd-base{background:rgba(96,165,250,0.1);color:#60a5fa}
  .bd-bonus{background:rgba(52,211,153,0.1);color:#34d399}
  .bd-malus{background:rgba(248,113,113,0.1);color:#f87171}
  .cm-footer{padding:16px 24px 22px;border-top:1px solid rgba(255,255,255,0.07);display:flex;gap:10px}
  .cm-btn-confirm{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.85rem;font-weight:700;background:linear-gradient(135deg,#fbbf24 0%,#ea580c 100%);color:#0d1117;border:none;padding:12px 20px;border-radius:10px;flex:1;cursor:pointer;box-shadow:0 4px 16px rgba(251,191,36,0.25);transition:transform 0.15s,box-shadow 0.15s}
  .cm-btn-confirm:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(251,191,36,0.35)}
  .cm-btn-confirm:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .cm-btn-cancel{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.85rem;font-weight:600;background:rgba(255,255,255,0.04);color:#8b97b8;border:1px solid rgba(255,255,255,0.08);padding:12px 20px;border-radius:10px;cursor:pointer;transition:background 0.15s}
  .cm-btn-cancel:hover{background:rgba(255,255,255,0.08);color:#eef2ff}

  /* Info approvazione */
  .cm-approval-info {
    display:flex; align-items:center; gap:8px;
    padding:10px 14px; border-radius:10px; margin-top:14px;
    background:rgba(251,191,36,0.06); border:1px solid rgba(251,191,36,0.15);
    font-size:0.75rem; color:#8b97b8; line-height:1.4;
  }
`;

function ChallengesPage() {
  const [challenges, setChallenges]     = useState([]);
  const [bonusMalus, setBonusMalus]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [pendingId, setPendingId]       = useState(null); 
  const [modal, setModal]               = useState(null);
  const [selectedMods, setSelectedMods] = useState([]);
  const [submitting, setSubmitting]     = useState(false);

  const userId  = parseInt(localStorage.getItem("userId"));
  const token   = localStorage.getItem("jwtToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchChallengesForUser = async () => {
    try {
      const leaguesRes = await fetch(`http://localhost:5247/api/leagues/user/${userId}`, { headers });
      if (!leaguesRes.ok) { setChallenges([]); return; }
      const leaguesRaw = await leaguesRes.json();
      const leagues = Array.isArray(leaguesRaw) ? leaguesRaw : leaguesRaw.$values ?? [];
      if (leagues.length === 0) { setChallenges([]); return; }
      const nested = await Promise.all(leagues.map(async (league) => {
        const res = await fetch(`http://localhost:5247/api/challenges/${league.id}`, { headers });
        if (!res.ok) return [];
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.$values ?? [];
        // Salviamo anche l'id della lega su ogni sfida — serve per il PointRequest
        return list.map(c => ({ ...c, leagueName: c.leagueName || league.name, leagueId: league.id }));
      }));
      const seen = new Set();
      setChallenges(nested.flat().filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; }));
    } catch { setChallenges([]); }
    finally { setLoading(false); }
  };

  const fetchBonusMalus = async () => {
    try {
      const res = await fetch("http://localhost:5247/api/bonusmalus", { headers });
      if (!res.ok) return;
      const data = await res.json();
      setBonusMalus(Array.isArray(data) ? data : data.$values ?? []);
    } catch { }
  };

  useEffect(() => { fetchChallengesForUser(); fetchBonusMalus(); }, []);

  const openModal  = (challenge) => { setModal({ challenge }); setSelectedMods([]); };
  const closeModal = () => { if (submitting) return; setModal(null); setSelectedMods([]); };
  const toggleMod  = (id) => setSelectedMods(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const calcTotal = () => {
    if (!modal) return 0;
    const base = modal.challenge.points || 0;
    return base + selectedMods.reduce((sum, id) => {
      const m = bonusMalus.find(b => b.id === id);
      if (!m) return sum;
      const pts = Math.abs(m.points || 0);
      return m.type === "Bonus" ? sum + pts : sum - pts;
    }, 0);
  };

  const handleConfirm = async () => {
    if (!modal) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5247/api/pointrequests", {
        method: "POST",
        headers,
        body: JSON.stringify({
          receiverUserId:   userId,
          challengeId:      modal.challenge.id,
          leagueId:         modal.challenge.leagueId,
          pointsRequested:  calcTotal(),
          bonusMalusIds:    selectedMods
        }),
      });
      if (!res.ok) throw new Error(await res.text() || "Errore");
      setPendingId(modal.challenge.id);
      setTimeout(() => setPendingId(null), 4000);
      closeModal();
    } catch (err) { alert("Errore: " + err.message); }
    finally { setSubmitting(false); }
  };

  const totalPoints = challenges.reduce((s, c) => s + (c.points || 0), 0);
  const bonus       = bonusMalus.filter(b => b.type === "Bonus");
  const malus       = bonusMalus.filter(b => b.type === "Malus");
  const grandTotal  = calcTotal();
  const bonusPts    = selectedMods.filter(id => bonusMalus.find(b=>b.id===id)?.type==="Bonus").reduce((s,id)=>s+Math.abs(bonusMalus.find(b=>b.id===id)?.points||0),0);
  const malusPts    = selectedMods.filter(id => bonusMalus.find(b=>b.id===id)?.type==="Malus").reduce((s,id)=>s+Math.abs(bonusMalus.find(b=>b.id===id)?.points||0),0);

  if (loading) return (
    <><style>{sharedStyles}{challengesPageStyles}</style>
      <div className="pg-root"><div className="pg-loading"><div className="pg-spinner"/></div></div>
    </>
  );

  return (
    <>
      <style>{sharedStyles}{challengesPageStyles}</style>

      {/* ── MODAL ── */}
      {modal && (
        <div className="cm-backdrop" onClick={closeModal}>
          <div className="cm-box" onClick={e => e.stopPropagation()}>

            <div className="cm-header">
              <div>
                <div className="cm-title">Segna come completata</div>
                <div className="cm-subtitle">Seleziona eventuali modificatori prima di confermare</div>
              </div>
              <button className="cm-close" onClick={closeModal}>✕</button>
            </div>

            <div className="cm-body">
              <div className="cm-challenge-info">
                <div>
                  <div className="cm-challenge-name">{modal.challenge.name}</div>
                  {modal.challenge.leagueName && <div className="cm-challenge-league">🏆 {modal.challenge.leagueName}</div>}
                </div>
                <span className="pg-badge pg-badge-blue">base: +{modal.challenge.points} pts</span>
              </div>

              {bonus.length > 0 && (
                <>
                  <p className="cm-section-label cm-section-label-bonus">⬆ Bonus opzionali</p>
                  {bonus.map(b => {
                    const sel = selectedMods.includes(b.id);
                    return (
                      <div key={b.id} className={`cm-modifier ${sel ? "selected-bonus" : ""}`} onClick={() => toggleMod(b.id)}>
                        <div className="cm-modifier-check">{sel ? "✓" : ""}</div>
                        <div style={{flex:1}}>
                          <div className="cm-modifier-name">{b.name}</div>
                          {b.description && <div className="cm-modifier-desc">{b.description}</div>}
                        </div>
                        <span className="pg-badge pg-badge-green">+{b.points} pts</span>
                      </div>
                    );
                  })}
                </>
              )}

              {malus.length > 0 && (
                <>
                  {bonus.length > 0 && <div className="cm-divider"/>}
                  <p className="cm-section-label cm-section-label-malus">⬇ Malus applicabili</p>
                  {malus.map(m => {
                    const sel = selectedMods.includes(m.id);
                    return (
                      <div key={m.id} className={`cm-modifier ${sel ? "selected-malus" : ""}`} onClick={() => toggleMod(m.id)}>
                        <div className="cm-modifier-check">{sel ? "✓" : ""}</div>
                        <div style={{flex:1}}>
                          <div className="cm-modifier-name">{m.name}</div>
                          {m.description && <div className="cm-modifier-desc">{m.description}</div>}
                        </div>
                        <span className="pg-badge pg-badge-red">−{m.points} pts</span>
                      </div>
                    );
                  })}
                </>
              )}

              {bonusMalus.length === 0 && (
                <p className="cm-empty-mods">Nessun modificatore disponibile — verranno assegnati i punti base.</p>
              )}

              <div className="cm-total">
                <div>
                  <div className="cm-total-label">Punti richiesti</div>
                  <div className="cm-total-breakdown">
                    <span className="bd-base">base +{modal.challenge.points}</span>
                    {bonusPts > 0 && <span className="bd-bonus">bonus +{bonusPts}</span>}
                    {malusPts > 0 && <span className="bd-malus">malus −{malusPts}</span>}
                  </div>
                </div>
                <div className={`cm-total-value ${grandTotal > 0 ? "positive" : grandTotal < 0 ? "negative" : "zero"}`}>
                  {grandTotal > 0 ? "+" : ""}{grandTotal}
                </div>
              </div>

              <div className="cm-approval-info">
                <span>⏳</span>
                <span>La richiesta verrà inviata all'admin per approvazione. I punti saranno accreditati solo dopo conferma.</span>
              </div>
            </div>

            <div className="cm-footer">
              <button className="cm-btn-cancel" onClick={closeModal}>Annulla</button>
              <button className="cm-btn-confirm" onClick={handleConfirm} disabled={submitting}>
                {submitting ? "⏳ Invio..." : `Invia richiesta (${grandTotal >= 0 ? "+" : ""}${grandTotal} pts)`}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── PAGINA ── */}
      <div className="pg-root">
        <div className="pg-content">

          <div className="challenges-hero">
            <div>
              <p className="pg-eyebrow">SummerSeason Platform</p>
              <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"2rem",fontWeight:900,color:"#eef2ff",letterSpacing:"-0.03em",lineHeight:1.1,margin:"6px 0 4px"}}>
                Le tue sfide
              </h1>
              <p style={{fontSize:"0.82rem",color:"#8b97b8",marginTop:2}}>
                {challenges.length > 0 ? `${challenges.length} sfide disponibili nelle tue leghe` : "Non sei ancora in nessuna lega"}
              </p>
            </div>
          </div>

          <div className="pg-stats">
            <div className="pg-stat-card"><div><p className="pg-stat-label">Sfide disponibili</p><p className="pg-stat-value">{challenges.length}</p></div><div className="pg-stat-icon">🏁</div></div>
            <div className="pg-stat-card"><div><p className="pg-stat-label">Punti ottenibili</p><p className="pg-stat-value">{totalPoints}</p></div><div className="pg-stat-icon pg-stat-icon-sun">⭐</div></div>
            <div className="pg-stat-card"><div><p className="pg-stat-label">Bonus disponibili</p><p className="pg-stat-value">{bonus.length}</p></div><div className="pg-stat-icon pg-stat-icon-green">⬆</div></div>
            <div className="pg-stat-card"><div><p className="pg-stat-label">Malus possibili</p><p className="pg-stat-value">{malus.length}</p></div><div className="pg-stat-icon" style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.25)"}}>⬇</div></div>
          </div>

          {challenges.length === 0 ? (
            <div className="pg-card">
              <div className="pg-empty" style={{padding:"60px 0"}}>
                <div style={{fontSize:"2.5rem",marginBottom:12}}>🏝️</div>
                <p style={{fontWeight:600,marginBottom:4,color:"var(--text)"}}>Nessuna sfida trovata</p>
                <p>Entra in una lega per vedere le sfide disponibili</p>
              </div>
            </div>
          ) : (
            <>
              <div className="challenges-count-bar">
                <span className="challenges-count-label">Sfide</span>
                <div className="challenges-count-line"/>
                <span className="pg-badge pg-badge-blue">{challenges.length} totali</span>
                <span className="pg-badge pg-badge-sun">{totalPoints} pts in palio</span>
              </div>

              <div className="pg-challenge-grid">
                {challenges.map((c, i) => (
                  <div key={c.id} className="pg-challenge-card" style={{animationDelay:`${i*0.05}s`}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                      <p className="pg-challenge-name">{c.name}</p>
                      <span className="pg-badge pg-badge-green" style={{flexShrink:0}}>+{c.points} pts</span>
                    </div>
                    <p className="pg-challenge-desc">{c.description}</p>
                    {c.leagueName && (
                      <span className="pg-badge pg-badge-sun" style={{alignSelf:"flex-start",fontSize:"0.65rem"}}>
                        🏆 {c.leagueName}
                      </span>
                    )}
                    {bonusMalus.length > 0 && (
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {bonus.length > 0 && <span style={{fontSize:"0.63rem",fontWeight:700,color:"#34d399",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",padding:"2px 8px",borderRadius:20}}>⬆ {bonus.length} bonus</span>}
                        {malus.length > 0 && <span style={{fontSize:"0.63rem",fontWeight:700,color:"#f87171",background:"rgba(248,113,113,0.08)",border:"1px solid rgba(248,113,113,0.2)",padding:"2px 8px",borderRadius:20}}>⬇ {malus.length} malus</span>}
                      </div>
                    )}
                    <div className="pg-challenge-footer">
                      {pendingId === c.id ? (
                        <span className="challenge-success-badge">⏳ In attesa di approvazione</span>
                      ) : (
                        <button className="pg-btn pg-btn-success pg-btn-sm" onClick={() => openModal(c)} style={{width:"100%"}}>
                          ✓ Segna completata
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {bonusMalus.length > 0 && (
            <div className="pg-card" style={{marginBottom:20}}>
              <div className="pg-card-header">
                <div className="pg-card-header-left"><div className="pg-card-icon">⭐</div><h2 className="pg-card-title">Modificatori disponibili</h2></div>
                <span className="pg-badge pg-badge-blue">{bonusMalus.length} modificatori</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
                <div style={{padding:"16px 24px",borderRight:"1px solid var(--border)"}}>
                  <p style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--success)",marginBottom:10}}>⬆ Bonus</p>
                  {bonus.length === 0
                    ? <p style={{fontSize:"0.78rem",color:"var(--text-light)"}}>Nessun bonus attivo</p>
                    : bonus.map(b => (
                      <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                        <div><div style={{fontSize:"0.83rem",fontWeight:600,color:"var(--text)"}}>{b.name}</div><div style={{fontSize:"0.72rem",color:"var(--text-muted)"}}>{b.description}</div></div>
                        <span className="pg-badge pg-badge-green" style={{flexShrink:0}}>+{b.points} pts</span>
                      </div>
                    ))}
                </div>
                <div style={{padding:"16px 24px"}}>
                  <p style={{fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--danger)",marginBottom:10}}>⬇ Malus</p>
                  {malus.length === 0
                    ? <p style={{fontSize:"0.78rem",color:"var(--text-light)"}}>Nessun malus attivo</p>
                    : malus.map(m => (
                      <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--border)"}}>
                        <div><div style={{fontSize:"0.83rem",fontWeight:600,color:"var(--text)"}}>{m.name}</div><div style={{fontSize:"0.72rem",color:"var(--text-muted)"}}>{m.description}</div></div>
                        <span className="pg-badge pg-badge-red" style={{flexShrink:0}}>{m.points} pts</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default ChallengesPage;