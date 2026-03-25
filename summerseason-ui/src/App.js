import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GlobalRankingPage from "./pages/GlobalRankingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import LeagueDataPage from "./pages/LeagueDataPage";
import UserDataPage from "./pages/UserDataPage";
import MainPage from "./pages/MainPage";
import ScrollToTop from "./components/ScrollToTop";
import ChallengesPage from "./pages/ChallengesPage";
import ChallengesAdminPage from "./pages/ChallengesAdminPage";
import LeagueDataAdminPage from "./pages/LeagueDataAdminPage";
import PointRequestPage from "./pages/PointRequestPage";
import RefereePage from "./pages/RefereePage";
import ChallengesRefereePage from "./pages/ChallengesRefereePage";
import RefereeProposalsPage from "./pages/RefereeProposalPage";

const globalReset = `
  *, *::before, *::after {
    border-color: rgba(255,255,255,0.08);
  }
  :root {
    --bs-border-color: rgba(255,255,255,0.08) !important;
    --bs-border-color-translucent: rgba(255,255,255,0.08) !important;
    --bs-body-bg: #0d1117 !important;
    --bs-body-color: #eef2ff !important;
    --bs-card-bg: #1a2236 !important;
    --bs-card-border-color: rgba(255,255,255,0.08) !important;
  }
  html, body, #root {
    background: #0d1117;
    color: #eef2ff;
    min-height: 100vh;
    margin: 0;
  }
  .bg-light   { background-color: #121826 !important; }
  .bg-white   { background-color: #1a2236 !important; }
  .text-muted { color: #8b97b8 !important; }
  .border, .border-top, .border-bottom, .border-start, .border-end {
    border-color: rgba(255,255,255,0.08) !important;
  }
  .card {
    background-color: #1a2236 !important;
    border-color: rgba(255,255,255,0.08) !important;
  }
  .form-control, .form-select {
    background-color: rgba(255,255,255,0.04) !important;
    border-color: rgba(255,255,255,0.1) !important;
    color: #eef2ff !important;
  }
  .form-control::placeholder { color: #4b5675 !important; }
  .form-control:focus, .form-select:focus {
    background-color: rgba(255,255,255,0.06) !important;
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(96,165,250,0.15) !important;
  }
  .alert-danger {
    background-color: rgba(248,113,113,0.1) !important;
    border-color: rgba(248,113,113,0.25) !important;
    color: #f87171 !important;
  }
  .btn-primary {
    background: linear-gradient(135deg, #fbbf24 0%, #ea580c 100%) !important;
    border-color: transparent !important;
    color: #0d1117 !important;
  }
`;

function getRolesFromStorage() {
  try {
    const stored = JSON.parse(localStorage.getItem("userRoles"));
    if (stored && stored.$values) return stored.$values;
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwtToken"));
  const [userRoles, setUserRoles] = useState(getRolesFromStorage());
  const [pendingNotifs, setPendingNotifs] = useState([]);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUserRoles(getRolesFromStorage());
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRoles");
    setIsLoggedIn(false);
    setUserRoles([]);
  };

  const isAdmin = userRoles.includes("Admin");
  const isReferee = userRoles.includes("Referee");

  return (
    <Router>
      <style>{globalReset}</style>
      <ScrollToTop />
      <Navbar onLogout={handleLogout} />

      <div style={{ minHeight: "100vh", background: "#0d1117" }}>
        <Routes>
          <Route path="/login"    element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/" replace /> : <SignUpPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/"         element={isLoggedIn ? (isAdmin ? <AdminPage />: isReferee? <Navigate to="/referee" replace />: <Navigate to="/profile" replace />): <MainPage />} />
          <Route path="/profile"  element={isLoggedIn ? <UserDataPage /> : <Navigate to="/login" replace />} />
          <Route path="/admin"    element={isLoggedIn && isAdmin ? <AdminPage /> : <Navigate to="/login" replace />} />
          <Route path="/user/:id" element={isLoggedIn ? <UserDataPage /> : <MainPage />} />
          <Route path="/league/:id" element={isLoggedIn && isAdmin ? <LeagueDataAdminPage /> : <LeagueDataPage />} />
          <Route path="*"         element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
          <Route path="/admin/requests" element={isLoggedIn && isAdmin ? <PointRequestPage /> : <Navigate to="/login" replace />} />
          <Route path="/referee" element={isLoggedIn && isReferee ? <RefereePage /> : <Navigate to="/login" replace />} />
          <Route path="/challenges"element={isAdmin? <ChallengesAdminPage />: isReferee? <ChallengesRefereePage />: <ChallengesPage />}/>
          <Route path="/admin/proposals" element={isLoggedIn && isAdmin ? <RefereeProposalsPage /> : <Navigate to="/login" replace />} />
          <Route path="/ranking" element={isLoggedIn ? <GlobalRankingPage /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;