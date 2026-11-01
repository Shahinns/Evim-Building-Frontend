import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import "./BottomNav.css";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cabinetPath = "/profile";

  const goAgencyListing = (e) => {
    e.preventDefault();
    if (user?.role === "AGENCY" || user?.role === "ADMIN") {
      navigate("/elan/yerlesdir");
    } else {
      navigate("/agencies");
    }
  };

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === "/" ? "active" : ""}`}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Ana səhifə</span>
      </Link>
      <Link
        to="/elan/yerlesdir"
        className={`nav-item plus-item ${location.pathname === "/elan/yerlesdir" ? "active" : ""}`}
      >
        <div className="plus-btn">+</div>
        <span className="nav-label">Elan ver</span>
      </Link>
      <a
        href="/agencies"
        className={`nav-item plus-item agency-item ${location.pathname === "/agencies" ? "active" : ""}`}
        onClick={goAgencyListing}
      >
        <div className="plus-btn agency-btn">🏢</div>
        <span className="nav-label">Agentlik üçün elan</span>
      </a>
      <Link to="/map" className={`nav-item ${location.pathname === "/map" ? "active" : ""}`}>
        <span className="nav-icon">🗺️</span>
        <span className="nav-label">Xəritə</span>
      </Link>
      <Link to={cabinetPath} className={`nav-item ${location.pathname === cabinetPath ? "active" : ""}`}>
        <span className="nav-icon">👤</span>
        <span className="nav-label">Kabinet</span>
      </Link>
    </div>
  );
};

export default BottomNav;
