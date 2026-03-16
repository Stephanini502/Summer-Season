import { navStyles } from "../style/SharedStyles";
import { useNavigate } from "react-router-dom";

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
  const userId = localStorage.getItem("userId");

  return (
    <>
      <style>{navStyles}</style>
      <nav className="nav-root">
        <div className="nav-inner">

          <div className="nav-brand" onClick={() => navigate("/")}>
            <div className="nav-brand-icon">☀️</div>
            <span className="nav-brand-text">Summer<span>Season</span></span>
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