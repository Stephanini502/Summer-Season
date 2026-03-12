import { useEffect, useState } from "react";
import { sharedStyles } from "../style/SharedStyles";

function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("jwtToken");

  const fetchChallenges = async () => {
    try {
      const response = await fetch("http://localhost:5247/api/challenges", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Errore nel caricamento delle sfide");
      const data = await response.json();
      if (Array.isArray(data)) setChallenges(data);
      else if (data.$values) setChallenges(data.$values);
      else setChallenges([]);
    } catch (error) {
      console.error("Errore fetchChallenges:", error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (challenge) => {
    try {
      setSubmitting(challenge.id);
      const body = { userId, challengeId: challenge.id, pointsAwarded: challenge.points };
      const response = await fetch("http://localhost:5247/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
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

  useEffect(() => { fetchChallenges(); }, []);

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
              <h1 className="pg-title">Sfide</h1>
              <p className="pg-subtitle">{challenges.length} sfide disponibili</p>
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
              <div className="pg-stat-icon pg-stat-icon-green">⭐</div>
            </div>
          </div>

          <div className="pg-challenge-grid">
            {challenges.length > 0 ? challenges.map((c, i) => (
              <div
                className="pg-challenge-card"
                key={c.id}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <p className="pg-challenge-name">{c.name}</p>
                  <span className="pg-badge pg-badge-green" style={{ flexShrink: 0 }}>+{c.points} pts</span>
                </div>
                <p className="pg-challenge-desc">{c.description}</p>
                {c.leagueName && (
                  <span className="pg-badge pg-badge-blue" style={{ alignSelf: "flex-start", fontSize: "0.65rem" }}>
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
            )) : (
              <div style={{ gridColumn: "1/-1" }}>
                <div className="pg-empty">Nessuna sfida disponibile</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default ChallengesPage;
