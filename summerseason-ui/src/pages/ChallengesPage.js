import { useEffect, useState } from "react";
import { sharedStyles } from "../style/SharedStyles";

const challengesPageStyles = `
  /* Override delle challenge card per il dark theme */
  .pg-challenge-card {
    background: #1a2236 !important;
    border-color: rgba(255,255,255,0.07) !important;
  }

  .pg-challenge-card:hover {
    border-color: rgba(255,255,255,0.13) !important;
    box-shadow: 0 8px 28px rgba(0,0,0,0.5), 0 0 20px rgba(96,165,250,0.08) !important;
  }

  /* Sezione header hero sfide */
  .challenges-hero {
    background: linear-gradient(130deg, #0c1428 0%, #0f1f3d 55%, #131f3a 100%);
    border: 1px solid rgba(96,165,250,0.12);
    border-radius: 14px;
    padding: 28px 32px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
    animation: pgFadeDown 0.45s ease both;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .challenges-hero::after {
    content: '🏁';
    position: absolute;
    right: 32px; top: 50%;
    transform: translateY(-50%);
    font-size: 4.5rem;
    opacity: 0.06;
    pointer-events: none;
  }

  /* Badge successo animato */
  .challenge-success-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: rgba(52,211,153,0.12);
    border: 1px solid rgba(52,211,153,0.3);
    color: #34d399;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    animation: successPop 0.25s ease both;
  }

  @keyframes successPop {
    0%   { transform: scale(0.85); opacity: 0; }
    60%  { transform: scale(1.05); }
    100% { transform: scale(1);    opacity: 1; }
  }

  /* Card counter badge */
  .challenges-count-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    animation: pgFadeUp 0.4s ease 0.15s both;
  }

  .challenges-count-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8b97b8;
  }

  .challenges-count-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }
`;

function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("jwtToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchChallengesForUser = async () => {
    try {
      const leaguesRes = await fetch(`http://localhost:5247/api/leagues/user/${userId}`, { headers });
      if (!leaguesRes.ok) { setChallenges([]); return; }

      const leaguesRaw = await leaguesRes.json();
      const leagues = Array.isArray(leaguesRaw) ? leaguesRaw : leaguesRaw.$values ?? [];

      if (leagues.length === 0) { setChallenges([]); return; }

      const allChallengesNested = await Promise.all(
        leagues.map(async (league) => {
          const res = await fetch(`http://localhost:5247/api/challenges/${league.id}`, { headers });
          if (!res.ok) return [];
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.$values ?? [];
          return list.map(c => ({ ...c, leagueName: c.leagueName || league.name }));
        })
      );

      const seen = new Set();
      const unique = allChallengesNested.flat().filter(c => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });

      setChallenges(unique);
    } catch (error) {
      console.error("Errore fetchChallengesForUser:", error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (challenge) => {
    try {
      setSubmitting(challenge.id);
      const response = await fetch("http://localhost:5247/api/results", {
        method: "POST",
        headers,
        body: JSON.stringify({ userId, challengeId: challenge.id, pointsAwarded: challenge.points }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Errore durante il salvataggio");
      }
      setSuccessId(challenge.id);
      setTimeout(() => setSuccessId(null), 2500);
    } catch (error) {
      console.error("Errore completeChallenge:", error);
      alert("Errore: " + error.message);
    } finally {
      setSubmitting(null);
    }
  };

  useEffect(() => { fetchChallengesForUser(); }, []);

  const totalPoints = challenges.reduce((s, c) => s + (c.points || 0), 0);

  if (loading) return (
    <>
      <style>{sharedStyles}{challengesPageStyles}</style>
      <div className="pg-root"><div className="pg-loading"><div className="pg-spinner" /></div></div>
    </>
  );

  return (
    <>
      <style>{sharedStyles}{challengesPageStyles}</style>
      <div className="pg-root">
        <div className="pg-content">

          {/* Hero header */}
          <div className="challenges-hero">
            <div>
              <p className="pg-eyebrow">SummerSeason Platform</p>
              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "2rem",
                fontWeight: 900,
                color: "#eef2ff",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                margin: "6px 0 4px"
              }}>
                Le tue sfide
              </h1>
              <p style={{ fontSize: "0.82rem", color: "#8b97b8", marginTop: 2 }}>
                {challenges.length > 0
                  ? `${challenges.length} sfide disponibili nelle tue leghe`
                  : "Non sei ancora in nessuna lega"}
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="pg-stats">
            <div className="pg-stat-card">
              <div>
                <p className="pg-stat-label">Sfide disponibili</p>
                <p className="pg-stat-value">{challenges.length}</p>
              </div>
              <div className="pg-stat-icon">🏁</div>
            </div>
            <div className="pg-stat-card">
              <div>
                <p className="pg-stat-label">Punti ottenibili</p>
                <p className="pg-stat-value">{totalPoints}</p>
              </div>
              <div className="pg-stat-icon pg-stat-icon-sun">⭐</div>
            </div>
          </div>

          {/* Empty state */}
          {challenges.length === 0 ? (
            <div className="pg-card">
              <div className="pg-empty" style={{ padding: "60px 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🏝️</div>
                <p style={{ fontWeight: 600, marginBottom: 4, color: "var(--text)" }}>
                  Nessuna sfida trovata
                </p>
                <p>Entra in una lega per vedere le sfide disponibili</p>
              </div>
            </div>
          ) : (
            <>
              {/* Separatore con contatore */}
              <div className="challenges-count-bar">
                <span className="challenges-count-label">Sfide</span>
                <div className="challenges-count-line" />
                <span className="pg-badge pg-badge-blue">{challenges.length} totali</span>
                <span className="pg-badge pg-badge-sun">{totalPoints} pts in palio</span>
              </div>

              {/* Griglia sfide */}
              <div className="pg-challenge-grid">
                {challenges.map((c, i) => (
                  <div
                    key={c.id}
                    className="pg-challenge-card"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {/* Header card */}
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8
                    }}>
                      <p className="pg-challenge-name">{c.name}</p>
                      <span className="pg-badge pg-badge-green" style={{ flexShrink: 0 }}>
                        +{c.points} pts
                      </span>
                    </div>

                    {/* Descrizione */}
                    <p className="pg-challenge-desc">{c.description}</p>

                    {/* Lega badge */}
                    {c.leagueName && (
                      <span className="pg-badge pg-badge-sun" style={{
                        alignSelf: "flex-start",
                        fontSize: "0.65rem"
                      }}>
                        🏆 {c.leagueName}
                      </span>
                    )}

                    {/* Footer azione */}
                    <div className="pg-challenge-footer">
                      {successId === c.id ? (
                        <span className="challenge-success-badge">
                          ✓ Completata!
                        </span>
                      ) : (
                        <button
                          className="pg-btn pg-btn-success pg-btn-sm"
                          disabled={submitting === c.id}
                          onClick={() => completeChallenge(c)}
                          style={{ width: "100%" }}
                        >
                          {submitting === c.id
                            ? "⏳ Salvataggio..."
                            : "✓ Segna completata"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default ChallengesPage;