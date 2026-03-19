import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sharedStyles } from "../style/SharedStyles";
import { pointRequestStyles } from "../style/SharedStyles";

function PointRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [note, setNote]         = useState({});
  const [acting, setActing]     = useState(null);
  const [toast, setToast]       = useState(null);

  const navigate = useNavigate();
  const token    = localStorage.getItem("jwtToken");
  const headers  = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5247/api/pointrequests/pending", { headers });
      if (!res.ok) return;
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : data.$values ?? []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPending(); }, []);

  const approve = async (id) => {
    setActing(id);
    try {
      const res = await fetch(`http://localhost:5247/api/pointrequests/${id}/approve`, {
        method: "PUT", headers,
        body: JSON.stringify({ adminNote: note[id] || "" })
      });
      if (!res.ok) throw new Error();
      setRequests(prev => prev.filter(r => r.id !== id));
      showToast("✓ Richiesta approvata — punti assegnati!", "approve");
    } catch {
      showToast("Errore durante l'approvazione", "reject");
    } finally { setActing(null); }
  };

  const reject = async (id) => {
    setActing(id);
    try {
      const res = await fetch(`http://localhost:5247/api/pointrequests/${id}/reject`, {
        method: "PUT", headers,
        body: JSON.stringify({ adminNote: note[id] || "" })
      });
      if (!res.ok) throw new Error();
      setRequests(prev => prev.filter(r => r.id !== id));
      showToast("✕ Richiesta rifiutata", "reject");
    } catch {
      showToast("Errore durante il rifiuto", "reject");
    } finally { setActing(null); }
  };

  if (loading) return (
    <>
      <style>{sharedStyles}{pointRequestStyles}</style>
      <div className="pg-root"><div className="pg-loading"><div className="pg-spinner"/></div></div>
    </>
  );

  return (
    <>
      <style>{sharedStyles}{pointRequestStyles}</style>

      {toast && (
        <div className={`pr-toast pr-toast-${toast.type}`}>{toast.msg}</div>
      )}

      <div className="pg-root">
        <div className="pg-content">

          <header className="pg-header">
            <div>
              <p className="pg-eyebrow">Admin · SummerSeason</p>
              <h1 className="pg-title">Richieste punti</h1>
              <p className="pg-subtitle">
                {requests.length > 0
                  ? `${requests.length} richieste in attesa di approvazione`
                  : "Nessuna richiesta in attesa"}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="pg-btn pg-btn-ghost" onClick={fetchPending}>
                ↻ Aggiorna
              </button>
              <button className="pg-btn pg-btn-ghost" onClick={() => navigate("/admin")}>
                ← Dashboard
              </button>
            </div>
          </header>

          {requests.length === 0 ? (
            <div className="pr-page-empty">
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✓</div>
              <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: 6 }}>
                Tutto in ordine!
              </p>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Non ci sono richieste in attesa di approvazione
              </p>
            </div>
          ) : (
            <div>
              {requests.map((r, i) => (
                <div
                  key={r.id}
                  className="pr-page-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="pr-page-item">

                    {/* Header richiesta */}
                    <div className="pr-page-item-top">
                      <div className="pr-avatar">
                        {(r.user?.name?.[0] ?? "?")}{(r.user?.surname?.[0] ?? "")}
                      </div>
                      <div className="pr-user-info">
                        <div className="pr-user-name">
                          {r.user?.name} {r.user?.surname}
                          <span className="pr-user-handle">@{r.user?.userName}</span>
                        </div>
                        <div className="pr-challenge-label">
                          Sfida: <span className="pr-challenge-name">{r.challenge?.name}</span>
                        </div>
                      </div>
                      <div className="pr-points-col">
                        <div className="pr-points-value">+{r.pointsRequested} pts</div>
                        <div className="pr-date">
                          {new Date(r.createdAt).toLocaleDateString("it-IT", {
                            day: "2-digit", month: "short",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Tag info */}
                    <div className="pr-meta">
                      <span className="pr-meta-tag">Sfida base: {r.challenge?.points} pts</span>
                      {r.pointsRequested !== r.challenge?.points && (
                        <span className="pr-meta-tag" style={{
                          background: "rgba(251,191,36,0.08)",
                          border: "1px solid rgba(251,191,36,0.2)",
                          color: "#fbbf24"
                        }}>
                          Con modificatori: +{r.pointsRequested} pts
                        </span>
                      )}
                    </div>

                    {/* Nota */}
                    <div className="pr-note-wrap">
                      <span className="pr-note-label">Nota per l'utente (opzionale)</span>
                      <input
                        className="pr-note-input"
                        placeholder="Es. ottimo lavoro! / non rispetta i criteri..."
                        value={note[r.id] || ""}
                        onChange={e => setNote(prev => ({ ...prev, [r.id]: e.target.value }))}
                      />
                    </div>

                    {/* Azioni */}
                    <div className="pr-actions">
                      <button
                        className="pr-btn-approve"
                        disabled={acting === r.id}
                        onClick={() => approve(r.id)}
                      >
                        {acting === r.id ? "..." : "✓ Approva richiesta"}
                      </button>
                      <button
                        className="pr-btn-reject"
                        disabled={acting === r.id}
                        onClick={() => reject(r.id)}
                      >
                        {acting === r.id ? "..." : "✕ Rifiuta"}
                      </button>
                    </div>

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

export default PointRequestsPage;