import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  const userId = parseInt(localStorage.getItem("userId"));
  const token = localStorage.getItem("jwtToken");

  const fetchChallenges = async () => {
    try {
      const response = await fetch("http://localhost:5247/api/challenges", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Errore nel caricamento delle sfide");
      }

      const data = await response.json();

      console.log(data)
      if (Array.isArray(data)) {
        setChallenges(data);
      } else if (data.$values) {
        setChallenges(data.$values);
      } else {
        setChallenges([]);
      }
    } catch (error) {
      console.error("Errore fetchChallenges:", error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

const completeChallenge = async (challenge) => {
  try {
    setSubmitting(challenge.Id); 

    const body = {
      userId: userId,
      challengeId: challenge.id, 
      pointsAwarded: challenge.points
    };

    const response = await fetch("http://localhost:5247/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Errore durante il salvataggio");
    }

    alert("Sfida completata! 🎉");
  } catch (error) {
    console.error("Errore completeChallenge:", error);
    alert("Errore: " + error.message);
  } finally {
    setSubmitting(null);
  }
};

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="mb-3">Elenco Sfide</h4>

          {loading ? (
            <p>Caricamento sfide...</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrizione</th>
                  <th>Punti</th>
                  <th>Azione</th>
                </tr>
              </thead>
              <tbody>
                {challenges.length > 0 ? (
                  challenges.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.description}</td>
                    <td>{c.points}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        disabled={submitting === c.id}
                        onClick={() => completeChallenge(c)}
                      >
                        {submitting === c.Id ? "Salvataggio..." : "Segna completata"}
                      </button>
                    </td>
                  </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Nessuna sfida presente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengesPage;