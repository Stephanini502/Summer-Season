import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("userId");
    window.location.reload(); 
  };

  const isLoggedIn = !!localStorage.getItem("jwtToken");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">Summer Season</a>
        <div className="d-flex">
          {!isLoggedIn && (
            <>
              <button
                className="btn btn-outline-light me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-light"
                onClick={() => navigate("/register")}
              >
                Registrati
              </button>
            </>
          )}
          {isLoggedIn && (
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
