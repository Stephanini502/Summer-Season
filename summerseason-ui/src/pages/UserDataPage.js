import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UserDataPage() {

  const { id } = useParams();
  const userId = id || localStorage.getItem("userId");
  const token = localStorage.getItem("jwtToken");

  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [rankings, setRankings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const normalizeDatas = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.$values) return data.$values;
    return [data];
  };

  const normalizeUserRanking = (u) => ({
    name: u.name || u.Name,
    surname: u.surname || u.Surname,
    userName: u.userName || u.UserName,
    totalPoints: u.totalPoints ?? u.TotalPoints ?? 0
  });

  const safeJson = async (response) => {
    if (!response.ok) throw new Error(`Errore API (${response.status})`);
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  };

  useEffect(() => {

    if (!userId) {
      setError("Utente non autenticato");
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all([
      fetch(`http://localhost:5247/api/users/${userId}`, { headers }).then(safeJson),
      fetch(`http://localhost:5247/api/users/${userId}/roles`, { headers }).then(safeJson),
      fetch(`http://localhost:5247/api/leagues/user/${userId}`, { headers }).then(safeJson),
    ])
      .then(async ([userData, rolesData, leaguesData]) => {

        const normalizedLeagues = normalizeDatas(leaguesData);

        setUser(userData);
        setRoles(normalizeDatas(rolesData));
        setLeagues(normalizedLeagues);

        const rankingMap = {};

        if (normalizedLeagues.length > 0) {

          await Promise.all(
            normalizedLeagues.map(async (league) => {

              const res = await fetch(
                `http://localhost:5247/api/leagues/${league.id}/ranking`,
                { headers }
              );

              const data = await res.json();

              rankingMap[league.id] = normalizeDatas(data)
                .map(normalizeUserRanking);
            })
          );
        }

        setRankings(rankingMap);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  }, [userId]);

  const getUserPosition = (leagueId) => {

    const ranking = rankings[leagueId] || [];

    const index = ranking.findIndex(
      (u) =>
        (u.userName || "").toLowerCase() ===
        user.userName.toLowerCase()
    );

    return index >= 0 ? index + 1 : null;
  };

  const getPositionBadge = (pos) => {
    if (!pos) return "-";
    if (pos === 1) return "🥇";
    if (pos === 2) return "🥈";
    if (pos === 3) return "🥉";
    return `#${pos}`;
  };

  if (loading) return <div className="p-5 text-center">Caricamento...</div>;
  if (error) return <div className="p-5 text-danger text-center">{error}</div>;
  if (!user) return <div className="p-5 text-center">Utente non trovato</div>;

  const totalLeagues = leagues.length;

  const totalPoints = Object.values(rankings)
    .flat()
    .filter((u) =>
      (u.userName || "").toLowerCase() === user.userName.toLowerCase()
    )
    .reduce((sum, u) => sum + Number(u.totalPoints || 0), 0);
  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}
    >
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light fw-semibold">
              Profilo Utente
            </div>
            <div className="card-body text-center">
              <h4 className="fw-bold">
                {user.name} {user.surname}
              </h4>
              <div className="text-muted mb-2">
                {user.userName}
              </div>
              <div className="mt-3">
                {roles.map((r, i) => (
                  <span key={i} className="badge bg-primary me-1">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light fw-semibold">
              Statistiche
            </div>

            <div className="card-body text-center">

              <h6 className="text-muted">Leghe</h6>
              <h3 className="text-primary">{totalLeagues}</h3>

              <h6 className="text-muted mt-3">Punti Totali</h6>
              <h3 className="text-success">{totalPoints}</h3>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/challenges`)}
            >
              Vai alle sfide
            </button>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light fw-semibold">
              Le mie leghe
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nome Lega</th>
                    <th>Data creazione</th>
                  </tr>
                </thead>
                <tbody>
                  {leagues.length > 0 ? (
                    leagues.map((l) => (
                      <tr
                        key={l.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/league/${l.id}`)}
                      >
                        <td>{l.name}</td>
                        <td>
                          {new Date(l.creationDate)
                            .toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="text-center text-muted py-4"
                      >
                        Nessuna lega
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-light fw-semibold">
                Posizione nelle classifiche
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Lega</th>
                    <th>Posizione</th>
                  </tr>
                </thead>
                <tbody>
                  {leagues.length > 0 ? (
                    leagues.map((league) => {
                      const pos = getUserPosition(league.id);
                      return (
                        <tr key={league.id}>
                          <td>{league.name}</td>
                          <td className="fw-semibold">
                            {getPositionBadge(pos)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center text-muted">
                        Nessuna lega
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
}

export default UserDataPage;