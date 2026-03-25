import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { navStyles } from "../style/SharedStyles";
import { notifStyles } from "../style/SharedStyles";

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

  useEffect(() => {
    if (!userId) return;
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [userId]);

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