import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function LeagueDataPage() {
  const { id } = useParams();

  const [league, setLeague] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRefereeId, setSelectedRefereeId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("jwtToken");
  const refereeRole = "Referee";

  // ---- Helpers ----
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
    roles: Array.isArray(u.roles ?? u.Roles)
      ? (u.roles ?? u.Roles).map((r) => r.toString())
      : [],
    totalPoints: u.totalPoints ?? u.TotalPoints ?? 0,
  });

  const referees = (participants || []).filter(
    (u) => userRoles[u.id] && userRoles[u.id].includes(refereeRole)
  );

  const loadRolesForParticipants = async (users) => {
    const rolesMap = {};

    await Promise.all(
      users.map(async (u) => {
        try {
          const res = await fetch(
            `http://localhost:5247/api/users/${u.id}/roles`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.ok) {
            let roles = await res.json();
            // Normalizza $values in array
            if (roles && roles.$values) roles = roles.$values;
            if (!Array.isArray(roles)) roles = [];
            rolesMap[u.id] = roles.map((r) => r.toString());
          } else {
            rolesMap[u.id] = [];
          }
        } catch (err) {
          console.error("Errore ruoli utente", u.id, err);
          rolesMap[u.id] = [];
        }
      })
    );

    setUserRoles(rolesMap);
  };
  useEffect(() => {
    if (!id) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    setLoading(true);
    setError("");

    const safeJson = async (response) => {
      if (!response.ok) throw new Error(`Errore API (${response.status})`);
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    };

    Promise.all([
      fetch(`http://localhost:5247/api/leagues/${id}`, { headers }).then(
        safeJson
      ),
      fetch(
        `http://localhost:5247/api/leagues/${id}/participants`,
        { headers }
      ).then(safeJson),
      fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers }).then(
        safeJson
      ),
      fetch(`http://localhost:5247/api/users`, { headers }).then(safeJson),
    ])
      .then(([leagueData, participantsData, rankingData, usersData]) => {
        setLeague(leagueData);

        const normalizedParticipants = normalizeValues(participantsData).map(
          normalizeUser
        );
        setParticipants(normalizedParticipants);

        const normalizedRanking = normalizeValues(rankingData).map(normalizeUser);
        setRanking(normalizedRanking);

        const normalizedUsers = normalizeValues(usersData).map(normalizeUser);
        setAllUsers(normalizedUsers);

        if (normalizedParticipants.length > 0) {
          loadRolesForParticipants(normalizedParticipants);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  const refreshParticipantsAndRanking = () => {
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`http://localhost:5247/api/leagues/${id}/participants`, { headers })
      .then((res) => res.json())
      .then((data) => {
        const normalized = normalizeValues(data).map(normalizeUser);
        setParticipants(normalized);
        loadRolesForParticipants(normalized);
      })
      .catch(console.error);

    fetch(`http://localhost:5247/api/leagues/${id}/ranking`, { headers })
      .then((res) => res.json())
      .then((data) => {
        const normalized = normalizeValues(data).map(normalizeUser);
        setRanking(normalized);
      })
      .catch(console.error);
  };

  const handleAddParticipant = () => {
    if (!selectedUserId) return;

    fetch(
      `http://localhost:5247/api/leagues/${id}/participants/${selectedUserId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Errore aggiunta partecipante");
        alert("Partecipante aggiunto!");
        setSelectedUserId("");
        refreshParticipantsAndRanking();
      })
      .catch((err) => alert(err.message));
  };

  const handleSetReferee = () => {
    if (!selectedRefereeId) return;

    fetch(`http://localhost:5247/api/users/${selectedRefereeId}/${refereeRole}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore assegnazione arbitro");
        alert("Arbitro assegnato!");
        setSelectedRefereeId("");
        refreshParticipantsAndRanking();
      })
      .catch((err) => alert(err.message));
  };

  if (loading) return <div className="p-5 text-center">Caricamento...</div>;
  if (error) return <div className="p-5 text-danger text-center">{error}</div>;
  if (!league) return <div className="p-5 text-center">Lega non trovata</div>;

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}
    >
      <div className="mb-4">
        <h2 className="fw-bold text-dark">{league.name}</h2>
        <span className="text-muted">
          Creata il {new Date(league.creationDate).toLocaleDateString()}
        </span>
      </div>

      <div className="row">
        {/* ---- Colonna sinistra ---- */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light fw-semibold">
              Informazioni Lega
            </div>
            <div className="card-body">
              <p>
                <strong>Partecipanti:</strong> {participants.length}
              </p>
              <p>
                <strong>Data creazione:</strong>{" "}
                {new Date(league.creationDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light fw-semibold">Statistica</div>
            <div className="card-body text-center">
              <h6 className="text-muted">Totale partecipanti</h6>
              <h2 className="text-primary">{participants.length}</h2>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light fw-semibold">Arbitro</div>
            <div className="card-body text-center">
              {referees.length > 0 ? (
                referees.map((r) => (
                  <div key={r.id}>
                    {r.name} {r.surname} ({r.userName})
                  </div>
                ))
              ) : (
                <div className="text-muted">Non assegnato</div>
              )}
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-light fw-semibold">Assegna Arbitro</div>
            <div className="card-body d-flex gap-2 align-items-center">
              <select
                className="form-select"
                value={selectedRefereeId}
                onChange={(e) => setSelectedRefereeId(e.target.value)}
              >
                <option value="">Seleziona partecipante...</option>
                {(participants || []).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.surname} ({u.userName})
                  </option>
                ))}
              </select>
              <button className="btn btn-warning" onClick={handleSetReferee}>
                Assegna
              </button>
            </div>
          </div>
        </div>

        {/* ---- Colonna destra ---- */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light fw-semibold">Aggiungi Partecipante</div>
            <div className="card-body d-flex gap-2 align-items-center">
              <select
                className="form-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Seleziona utente...</option>
                {(allUsers || []).map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.surname} ({u.userName})
                  </option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleAddParticipant}>
                Aggiungi
              </button>
            </div>
          </div>

          {/* Partecipanti */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-light fw-semibold">Partecipanti</div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nome</th>
                    <th>Username</th>
                    <th>Punti</th>
                  </tr>
                </thead>
                <tbody>
                  {(participants || []).length > 0 ? (
                    (participants || []).map((u) => (
                      <tr key={u.id}>
                        <td>
                          {u.name || "-"} {u.surname || ""}
                        </td>
                        <td>{u.userName || "-"}</td>
                        <td>{u.totalPoints || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        Nessun partecipante
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Classifica */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light fw-semibold">Classifica Lega</div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Username</th>
                    <th>Punti</th>
                  </tr>
                </thead>
                <tbody>
                  {(ranking || []).length > 0 ? (
                    (ranking || []).map((u, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {u.name || "-"} {u.surname || ""}
                        </td>
                        <td>{u.userName || "-"}</td>
                        <td>{u.totalPoints || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        Nessun partecipante
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeagueDataPage;
