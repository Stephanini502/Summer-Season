import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { navStyles } from "../style/SharedStyles";

const notifStyles = `
  .notif-bell-wrap { position: relative; display: inline-flex; align-items: center; }

  .notif-badge {
    position: absolute; top: -5px; right: -5px;
    min-width: 17px; height: 17px;
    background: #ef4444; color: #fff;
    font-size: 0.6rem; font-weight: 800;
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 4px;
    border: 2px solid #0d1117;
    pointer-events: none;
    animation: badgePop 0.2s ease both;
  }
  @keyframes badgePop {
    from { transform: scale(0.4); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }

  .notif-dropdown {
    position: absolute; top: calc(100% + 10px); right: -10px;
    width: 340px;
    background: #1a2236;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.55);
    z-index: 300; overflow: hidden;
    animation: dropIn 0.18s ease both;
  }
  @keyframes dropIn {
    from { opacity:0; transform: translateY(-8px); }
    to   { opacity:1; transform: translateY(0); }
  }

  .notif-header {
    padding: 14px 18px 10px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .notif-header-title {
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem; font-weight: 700; color: #eef2ff;
  }
  .notif-read-all {
    font-size: 0.7rem; font-weight: 600; color: #60a5fa;
    background: none; border: none; cursor: pointer; padding: 0;
    transition: color 0.15s;
  }
  .notif-read-all:hover { color: #93c5fd; }

  .notif-list { max-height: 320px; overflow-y: auto; }
  .notif-list::-webkit-scrollbar { width: 3px; }
  .notif-list::-webkit-scrollbar-track { background: transparent; }
  .notif-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

  .notif-item {
    padding: 12px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: flex-start; gap: 10px;
    cursor: pointer; transition: background 0.13s;
  }
  .notif-item:last-child { border-bottom: none; }
  .notif-item:hover { background: rgba(255,255,255,0.03); }
  .notif-item.unread { background: rgba(96,165,250,0.05); }
  .notif-item.unread:hover { background: rgba(96,165,250,0.09); }

  .notif-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #3b82f6; flex-shrink: 0; margin-top: 5px;
    transition: opacity 0.2s;
  }
  .notif-dot.read { opacity: 0; }

  .notif-icon {
    width: 30px; height: 30px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; flex-shrink: 0;
  }
  .notif-icon-pending  { background: rgba(251,191,36,0.1);  border: 1px solid rgba(251,191,36,0.2); }
  .notif-icon-approved { background: rgba(52,211,153,0.1);  border: 1px solid rgba(52,211,153,0.2); }
  .notif-icon-rejected { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2); }

  .notif-msg  { font-size: 0.78rem; color: #eef2ff; line-height: 1.4; flex: 1; }
  .notif-time { font-size: 0.65rem; color: #4b5675; margin-top: 3px; }

  .notif-empty {
    padding: 28px 18px; text-align: center;
    font-size: 0.78rem; color: #4b5675;
  }
`;

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "adesso";
  if (m < 60) return `${m}m fa`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h fa`;
  return `${Math.floor(h / 24)}g fa`;
}

function NotificationBell({ userId, token, isAdmin }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen]   = useState(false);
  const [unread, setUnread] = useState(0);
  const dropRef = useRef();
  const navigate = useNavigate();

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchNotifs = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5247/api/notifications/user/${userId}`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.$values ?? [];
      setNotifications(list);
      setUnread(list.filter(n => !n.isRead).length);
    } catch { }
  };

  // Polling ogni 30 secondi
  useEffect(() => {
    if (!userId) return;
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Chiudi dropdown cliccando fuori
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (notif) => {
    if (!notif.isRead) {
      await fetch(`http://localhost:5247/api/notifications/${notif.id}/read`, { method: "PUT", headers });
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    }
    // Se admin clicca su una PointRequest, va alla dashboard
    if (notif.type === "PointRequest" && isAdmin) {
      setOpen(false);
      navigate("/admin");
    }
  };

  const markAllRead = async () => {
    await fetch(`http://localhost:5247/api/notifications/user/${userId}/read-all`, { method: "PUT", headers });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const iconForType = (type) => {
    if (type === "PointRequest") return { cls: "notif-icon-pending",  emoji: "⏳" };
    if (type === "Approved")     return { cls: "notif-icon-approved", emoji: "✓" };
    if (type === "Rejected")     return { cls: "notif-icon-rejected", emoji: "✕" };
    return { cls: "notif-icon-pending", emoji: "🔔" };
  };

  return (
    <div className="notif-bell-wrap" ref={dropRef}>
      <button
        className="nav-btn nav-btn-ghost"
        onClick={() => setOpen(o => !o)}
        style={{ position: "relative", fontSize: "1rem" }}
        title="Notifiche"
      >
        🔔
        {unread > 0 && (
          <span className="notif-badge">{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span className="notif-header-title">Notifiche</span>
            {unread > 0 && (
              <button className="notif-read-all" onClick={markAllRead}>
                Segna tutte come lette
              </button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">Nessuna notifica</div>
            ) : (
              notifications.map(n => {
                const { cls, emoji } = iconForType(n.type);
                return (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.isRead ? "unread" : ""}`}
                    onClick={() => markRead(n)}
                  >
                    <div className={`notif-dot ${n.isRead ? "read" : ""}`} />
                    <div className={`notif-icon ${cls}`}>{emoji}</div>
                    <div>
                      <div className="notif-msg">{n.message}</div>
                      <div className="notif-time">{timeAgo(n.createdAt)}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("userId");
    onLogout();
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("jwtToken");
  const userId     = localStorage.getItem("userId");
  const token      = localStorage.getItem("jwtToken");

  // Determina se l'utente è admin dai roles salvati
  const isAdmin = (() => {
    try {
      const roles = JSON.parse(localStorage.getItem("userRoles") || "[]");
      const arr = Array.isArray(roles) ? roles : roles.$values ?? [];
      return arr.includes("Admin");
    } catch { return false; }
  })();

  return (
    <>
      <style>{navStyles}{notifStyles}</style>
      <nav className="nav-root">
        <div className="nav-inner">

          <div className="nav-brand" onClick={() => navigate("/")}>
            <div className="nav-brand-icon">☀️</div>
            <span className="nav-brand-text">Summer<span className="brand-season">Season</span></span>
          </div>

          <div className="nav-actions">
            {!isLoggedIn && (
              <>
                <button className="nav-btn nav-btn-ghost" onClick={() => navigate("/login")}>
                  Accedi
                </button>
                <button className="nav-btn nav-btn-primary" onClick={() => navigate("/register")}>
                  Registrati
                </button>
              </>
            )}

            {isLoggedIn && (
              <>
                {userId && (
                  <button className="nav-btn nav-btn-ghost" onClick={() => navigate(`/user/${userId}`)}>
                    👤 Il mio profilo
                  </button>
                )}

                <NotificationBell
                  userId={userId}
                  token={token}
                  isAdmin={isAdmin}
                />

                <div className="nav-divider" />
                <button className="nav-btn nav-btn-outline" onClick={handleLogout}>
                  Esci
                </button>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}

export default Navbar;