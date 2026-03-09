import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUserRoles(getRolesFromStorage());
  };
  

  const isAdmin = userRoles.includes("Admin");

  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <div style={{ padding: "20px", backgroundColor: "#eef2f7", minHeight: "100vh" }}>
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/" replace /> : <SignUpPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/"
            element={isLoggedIn ? (isAdmin ? <AdminPage /> : <Navigate to="/profile" replace />) : <MainPage />}
          />
          <Route
            path="/profile"
            element={isLoggedIn ? <UserDataPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={isLoggedIn && isAdmin ? <AdminPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/challenges"
            element={ <ChallengesPage />}
          />
          <Route
            path="/admin/challenges"
            element= {isLoggedIn && isAdmin ? <ChallengesAdminPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/user/:id"
            element={isLoggedIn ? <UserDataPage /> : <MainPage />}
          />
          <Route
            path="/league/:id"
            element={isLoggedIn ? <LeagueDataPage /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
