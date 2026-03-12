import { useEffect, useState } from "react";
import { sharedStyles } from "../style/SharedStyles";

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
      const leagues = Array.isArray(leaguesRaw)
        ? leaguesRaw
        : leaguesRaw.$values ?? [];

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

  if (loading) return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root"><div className="pg-loading"><div className="pg-spinner" /></div></div>
    </>
  );

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root">
        <div className="pg-content">

          <header className="pg-header">
            <div>
              <p className="pg-eyebrow">SummerSeason Platform</p>
              <h1 className="pg-title">Le tue sfide</h1>
              <p className="pg-subtitle">
                {challenges.length > 0
                  ? `${challenges.length} sfide disponibili nelle tue leghe`
                  : "Non sei ancora in nessuna lega"}
              </p>
            </div>
          </header>

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
                <p className="pg-stat-value">{challenges.reduce((s, c) => s + (c.points || 0), 0)}</p>
              </div>
              <div className="pg-stat-icon pg-stat-icon-sun">⭐</div>
            </div>
          </div>

          {challenges.length === 0 ? (
            <div className="pg-card">
              <div className="pg-empty" style={{ padding: "60px 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🏝️</div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Nessuna sfida trovata</p>
                <p>Entra in una lega per vedere le sfide disponibili</p>
              </div>
            </div>
          ) : (
            <div className="pg-challenge-grid">
              {challenges.map((c, i) => (
                <div
                  key={c.id}
                  className="pg-challenge-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <p className="pg-challenge-name">{c.name}</p>
                    <span className="pg-badge pg-badge-green" style={{ flexShrink: 0 }}>+{c.points} pts</span>
                  </div>
                  <p className="pg-challenge-desc">{c.description}</p>
                  {c.leagueName && (
                    <span className="pg-badge pg-badge-sun" style={{ alignSelf: "flex-start", fontSize: "0.65rem" }}>
                      🏆 {c.leagueName}
                    </span>
                  )}
                  <div className="pg-challenge-footer">
                    {successId === c.id ? (
                      <span className="pg-badge pg-badge-green" style={{ padding: "8px 14px" }}>✓ Completata!</span>
                    ) : (
                      <button
                        className="pg-btn pg-btn-success pg-btn-sm"
                        disabled={submitting === c.id}
                        onClick={() => completeChallenge(c)}
                      >
                        {submitting === c.id ? "Salvataggio..." : "✓ Segna completata"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default ChallengesPage;