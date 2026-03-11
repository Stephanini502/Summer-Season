import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    setLoading(true);
    setError("");

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [leagueData, rankingData, challengesData] = await Promise.all([
        fetch(`http://localhost:5247/api/leagues/${id}`, { headers }).then(res => res.json()),
        fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers }).then(res => res.json()),
        fetch(`http://localhost:5247/api/challenges/${id}`, { headers }).then(res => res.json()),
      ]);

      setLeague(leagueData);

      // Ordina i partecipanti per punti decrescenti
      const normalizedParticipants = normalizeValues(rankingData)
        .map(normalizeUser)
        .sort((a, b) => b.totalPoints - a.totalPoints);

      setParticipants(normalizedParticipants);
      setChallenges(normalizeValues(challengesData).map(normalizeChallenge));
    } catch (err) {
      console.error(err);
      setError("Errore caricamento dati lega");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeagueData();
  }, [id]);

  if (loading) return <div className="p-5 text-center">Caricamento...</div>;
  if (error) return <div className="p-5 text-danger text-center">{error}</div>;
  if (!league) return <div className="p-5 text-center">Lega non trovata</div>;

  // Primo in classifica
  const topPlayer = participants.length > 0 ? participants[0] : null;

  return (
    <div style={{ backgroundColor: "#f5f6fa", minHeight: "100vh", paddingBottom: "50px" }}>
      
      {/* Hero Section */}
      <div
        className="d-flex flex-column flex-md-row justify-content-between align-items-center p-5 mb-5"
        style={{
          background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
          color: "#fff",
          borderRadius: "15px",
          margin: "20px auto",
          maxWidth: "1200px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <div>
          <h1 className="fw-bold mb-2">{league.name}</h1>
          <p className="mb-0">Creata il {new Date(league.creationDate).toLocaleDateString()}</p>
        </div>
        <button
          className="btn btn-light btn-lg mt-3 mt-md-0"
          style={{ fontWeight: "600" }}
          onClick={() => navigate(`/challenges`)}
        >
          Vai alle sfide
        </button>
      </div>

      <div className="container" style={{ maxWidth: "1200px" }}>
        <div className="row g-4">

          {/* Statistiche rapide */}
          <div className="col-12 mb-4">
            <div className="d-flex justify-content-between flex-wrap gap-3">
              <div className="bg-white rounded shadow-sm flex-fill p-3 text-center">
                <h6 className="text-muted mb-1">Partecipanti</h6>
                <h3 className="fw-bold">{participants.length}</h3>
              </div>
              <div className="bg-white rounded shadow-sm flex-fill p-3 text-center">
                <h6 className="text-muted mb-1">Sfide Totali</h6>
                <h3 className="fw-bold">{challenges.length}</h3>
              </div>
              <div className="bg-white rounded shadow-sm flex-fill p-3 text-center">
                <h6 className="text-muted mb-1">Leader attuale</h6>
                <h5 className="fw-bold">{topPlayer ? `${topPlayer.name} ${topPlayer.surname}` : "N/A"}</h5>
                <div className="text-muted small">{topPlayer ? topPlayer.userName : ""}</div>
              </div>
            </div>
          </div>

          {/* Partecipanti */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light fw-semibold border-bottom">Partecipanti</div>
              <ul className="list-group list-group-flush">
                {participants.length > 0 ? (
                  participants.map((u, idx) => (
                    <li
                      key={u.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ cursor: "pointer", transition: "0.2s" }}
                      onClick={() => navigate(`/user/${u.id}`)}
                      onMouseOver={e => e.currentTarget.style.backgroundColor="#f1f3f6"}
                      onMouseOut={e => e.currentTarget.style.backgroundColor="transparent"}
                    >
                      <div>
                        <div className="fw-semibold">{idx + 1}. {u.name} {u.surname}</div>
                        <div className="text-muted small">{u.userName}</div>
                      </div>
                      <span className="badge bg-primary rounded-pill">{u.totalPoints} pts</span>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-muted my-3">Nessun partecipante nella lega</p>
                )}
              </ul>
            </div>
          </div>

          {/* Sfide */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light fw-semibold border-bottom">Sfide</div>
              <ul className="list-group list-group-flush">
                {challenges.length > 0 ? (
                  challenges.map((c) => (
                    <li
                      key={c.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{ transition: "0.2s" }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor="#f1f3f6"}
                      onMouseOut={e => e.currentTarget.style.backgroundColor="transparent"}
                    >
                      <div>
                        <div className="fw-semibold">{c.name}</div>
                        <div className="text-muted small">{c.description}</div>
                      </div>
                      <span className="badge bg-success rounded-pill">{c.points} pts</span>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-muted my-3">Nessuna sfida disponibile</p>
                )}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LeagueDataPage;