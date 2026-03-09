import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ChallengesAdminPage() {
  const [challenges, setChallenges] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    description: "",
    points: 0,
    leagueId: ""
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("jwtToken");

  // Fetch challenges
  const fetchChallenges = async () => {
    try {
      if (!token) {
        console.error("Token JWT mancante");
        return;
      }

      const response = await fetch("http://localhost:5247/api/challenges", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Errore backend fetchChallenges:", text);
        setChallenges([]);
        return;
      }

      const data = await response.json();
      console.log("Challenges fetched:", data);

      if (Array.isArray(data)) setChallenges(data);
      else if (data.$values) setChallenges(data.$values);
      else setChallenges([]);
    } catch (err) {
      console.error("Errore fetchChallenges:", err);
      setChallenges([]);
    }
  };

  // Fetch leagues
  const fetchLeagues = async () => {
    try {
      if (!token) {
        console.error("Token JWT mancante");
        return;
      }

      const response = await fetch("http://localhost:5247/api/leagues", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Errore backend fetchLeagues:", text);
        setLeagues([]);
        return;
      }

      const data = await response.json();
      console.log("Leagues fetched:", data);

      if (Array.isArray(data)) setLeagues(data);
      else if (data.$values) setLeagues(data.$values);
      else setLeagues([]);
    } catch (err) {
      console.error("Errore fetchLeagues:", err);
      setLeagues([]);
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchLeagues();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      console.error("Token JWT mancante");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5247/api/challenges/${editingId}`
      : "http://localhost:5247/api/challenges";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newChallenge,
          points: parseInt(newChallenge.points) || 0,
          leagueId: parseInt(newChallenge.leagueId) || 0
        })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Errore submit:", text);
        return;
      }

      setNewChallenge({ name: "", description: "", points: 0, leagueId: "" });
      setEditingId(null);
      fetchChallenges();
    } catch (err) {
      console.error("Errore handleSubmit:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return;
    if (!window.confirm("Sei sicuro?")) return;

    try {
      const res = await fetch(`http://localhost:5247/api/challenges/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Errore delete:", text);
      }
      fetchChallenges();
    } catch (err) {
      console.error("Errore delete:", err);
    }
  };

  const handleEdit = (challenge) => {
    setEditingId(challenge.id);
    setNewChallenge({
      name: challenge.name || "",
      description: challenge.description || "",
      points: challenge.points || 0,
      leagueId: challenge.leagueId || ""
    });
  };

  return (
    <div className="container mt-4">
      <h2>Gestione Sfide</h2>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Nome</label>
              <input
                type="text"
                className="form-control"
                value={newChallenge.name}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, name: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Descrizione</label>
              <textarea
                className="form-control"
                value={newChallenge.description}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, description: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Punti</label>
              <input
                type="number"
                className="form-control"
                value={newChallenge.points}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, points: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label>Lega</label>
              <select
                className="form-control"
                value={newChallenge.leagueId}
                onChange={(e) =>
                  setNewChallenge({ ...newChallenge, leagueId: e.target.value })
                }
                required
              >
                <option value="">Seleziona una lega</option>
                {Array.isArray(leagues) &&
                  leagues.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
              </select>
            </div>

            <button className="btn btn-primary">
              {editingId ? "Aggiorna" : "Aggiungi"}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingId(null);
                  setNewChallenge({ name: "", description: "", points: 0, leagueId: "" });
                }}
              >
                Annulla
              </button>
            )}
          </form>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Punti</th>
            <th>Lega</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(challenges) &&
            challenges.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>{c.points}</td>
                <td>{c.leagueName || ""}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(c)}
                  >
                    Modifica
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChallengesAdminPage;