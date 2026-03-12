import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sharedStyles } from "../style/SharedStyles";

function LeagueDataPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [league, setLeague] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("jwtToken");

  const normalizeValues = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };

  const normalizeUser = (u) => ({
    id: u.id ?? u.Id,
    name: u.name ?? u.Name ?? "",
    surname: u.surname ?? u.Surname ?? "",
    userName: u.userName ?? u.UserName ?? "",
    totalPoints: u.totalPoints ?? u.TotalPoints ?? 0,
  });

  const normalizeChallenge = (c) => ({
    id: c.id ?? c.Id,
    name: c.name ?? c.Name ?? "",
    description: c.description ?? c.Description ?? "",
    points: c.points ?? c.Points ?? 0,
  });

  const fetchLeagueData = async () => {
    setLoading(true); setError("");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [leagueData, rankingData, challengesData] = await Promise.all([
        fetch(`http://localhost:5247/api/leagues/${id}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers }).then(r => r.json()),
        fetch(`http://localhost:5247/api/challenges/${id}`, { headers }).then(r => r.json()),
      ]);
      setLeague(leagueData);
      setParticipants(
        normalizeValues(rankingData)
          .map(normalizeUser)
          .sort((a, b) => b.totalPoints - a.totalPoints)
      );
      setChallenges(normalizeValues(challengesData).map(normalizeChallenge));
    } catch (err) {
      setError("Errore caricamento dati lega");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeagueData(); }, [id]);

  if (loading) return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root"><div className="pg-loading"><div className="pg-spinner" /></div></div>
    </>
  );

  if (error) return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root"><div className="pg-alert pg-alert-danger">⚠️ {error}</div></div>
    </>
  );

  if (!league) return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root"><div className="pg-empty">Lega non trovata</div></div>
    </>
  );

  const topPlayer = participants.length > 0 ? participants[0] : null;
  const totalPts = challenges.reduce((s, c) => s + (c.points || 0), 0);

  const rankClass = (i) =>
    i === 0 ? "pg-rank pg-rank-1" :
    i === 1 ? "pg-rank pg-rank-2" :
    i === 2 ? "pg-rank pg-rank-3" : "pg-rank";

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="pg-root">
        <div className="pg-content">

          <div className="pg-hero">
            <div>
              <p className="pg-hero-eyebrow">Pagina Lega</p>
              <h1 className="pg-hero-title">{league.name}</h1>
              <p className="pg-hero-sub">
                Creata il {new Date(league.creationDate).toLocaleDateString("it-IT")}
              </p>
            </div>
            <button className="pg-btn-hero" onClick={() => navigate("/challenges")}>
              🏁 Vai alle sfide
            </button>
          </div>

          <div className="pg-stats">
            <div className="pg-stat-card">
              <div>
                <p className="pg-stat-label">Partecipanti</p>
                <p className="pg-stat-value">{participants.length}</p>
              </div>
              <div className="pg-stat-icon">👥</div>
            </div>
            <div className="pg-stat-card">
              <div>
                <p className="pg-stat-label">Sfide di questa lega</p>
                <p className="pg-stat-value">{challenges.length}</p>
              </div>
              <div className="pg-stat-icon">🏁</div>
            </div>
            <div className="pg-stat-card">
              <div>
                <p className="pg-stat-label">Punti ottenibili</p>
                <p className="pg-stat-value">{totalPts}</p>
              </div>
              <div className="pg-stat-icon pg-stat-icon-sun">⭐</div>
            </div>
            {topPlayer && (
              <div className="pg-stat-card">
                <div>
                  <p className="pg-stat-label">Leader attuale</p>
                  <p className="pg-stat-value-sm">{topPlayer.name} {topPlayer.surname}</p>
                  <p className="pg-stat-sub">{topPlayer.userName} · {topPlayer.totalPoints} pts</p>
                </div>
                <div className="pg-stat-icon pg-stat-icon-yellow">🥇</div>
              </div>
            )}
          </div>

          <div className="pg-grid-2">

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

            <div className="pg-card" style={{ marginBottom: 0 }}>
              <div className="pg-card-header">
                <div className="pg-card-header-left">
                  <div className="pg-card-icon">🏁</div>
                  <h2 className="pg-card-title">Sfide di questa lega</h2>
                </div>
                {challenges.length > 0 && (
                  <span className="pg-badge pg-badge-sun">{challenges.length} sfide</span>
                )}
              </div>
              <ul className="pg-list">
                {challenges.length > 0 ? challenges.map(c => (
                  <li key={c.id} className="pg-list-item">
                    <div>
                      <div className="pg-list-item-name">{c.name}</div>
                      <div className="pg-list-item-sub">{c.description}</div>
                    </div>
                    <span className="pg-badge pg-badge-green">+{c.points} pts</span>
                  </li>
                )) : (
                  <li>
                    <div className="pg-empty" style={{ padding: "32px 0" }}>
                      <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🏝️</div>
                      <p>Nessuna sfida assegnata a questa lega</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default LeagueDataPage;