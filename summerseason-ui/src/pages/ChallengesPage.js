import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function ChallengesPage() {

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    try {

      const response = await fetch("http://localhost:5247/api/challenges");

      if (!response.ok) {
        throw new Error("Errore nella risposta della API");
      }

      const data = await response.json();
      console.log("API response:", data);

      // gestisce array normale o oggetto con $values
      if (Array.isArray(data)) {
        setChallenges(data);
      } else if (data.$values) {
        setChallenges(data.$values);
      } else {
        setChallenges([]);
      }

    } catch (error) {
      console.error("Errore nel caricamento sfide:", error);
      setChallenges([]);
    } finally {
      setLoading(false);
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
                </tr>
              </thead>

              <tbody>

                {challenges.length > 0 ? (
                  challenges.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.description}</td>
                      <td>{c.points}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
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