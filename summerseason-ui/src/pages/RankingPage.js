import { useEffect, useState } from "react";

function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5247/api/challenges")
      .then(res => res.json())
      .then(data => setChallenges(data));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Classifica</h2>
      <ul style={styles.list}>
        {challenges.map(c => (
          <li key={c.id} style={styles.listItem}>
            <strong>{c.name}</strong>
            <span>{c.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: { textAlign: "center", marginBottom: "15px", color: "#333" },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    marginBottom: "5px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
};

export default ChallengesPage;
