import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { useFavorites } from "../context/FavoritesContext";
import { API_BASE, apiFetch } from "../config/api";
import "../styles/Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation(); // əlavə et
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [stats, setStats] = React.useState({ total: 0, myCount: 0 });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  React.useEffect(() => {
    if (isMenuOpen) {
      apiFetch(`${API_BASE}/api/buildings`)
        .then(res => res.json())
        .then(data => setStats(prev => ({ ...prev, total: data.length })))
        .catch(() => {});

        if (user) {
        apiFetch(`${API_BASE}/api/buildings/my-listings`)
          .then(res => res.json())
          .then(data => setStats(prev => ({ ...prev, myCount: data.length })))
          .catch(() => {});
      }
    }
  }, [isMenuOpen, user]);

  const handleNewListing = (e) => {
    // Artıq login tələb olunmur
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="navbar-hamburger" onClick={toggleMenu} title="Menyu">☰</button>
          <Link to="/" className="navbar-logo">
            NaxEv<span className="logo-dot">.</span>az
          </Link>
        </div>
        <ul className="navbar-links desktop-only">
          <li>
            <Link 
              to="/elan?type=sale" 
              className={location.search.includes("sale") ? "active" : ""}
            >
              Alqı-satqı
            </Link>
          </li>
          <li>
            <Link 
              to="/elan?type=rent" 
              className={location.search.includes("rent") ? "active" : ""}
            >
              Kirayə
            </Link>
          </li>
          <li>
            <Link to="/agencies" className={location.pathname === "/agencies" ? "active" : ""}>
              Agentliklər
            </Link>
          </li>
          <li>
            <Link to="/favorites" className={location.pathname === "/favorites" ? "active" : ""}>
              ❤️ Seçilmişlər {favorites.length > 0 && <span className="fav-count">({favorites.length})</span>}
            </Link>
          </li>
          <li>
            <Link to="/map" className={location.pathname === "/map" ? "active" : ""}>
              🗺️ Xəritə
            </Link>
          </li>
        </ul>

        <div className="navbar-right-group desktop-only">
          <Link 
            to="/elan/yerlesdir" 
            className="navbar-new-listing desktop-only"
          >
            <span style={{ fontSize: '1.1rem', fontWeight: '700', marginRight: '3px' }}>+</span> Yeni elan
          </Link>

          <div className="navbar-auth desktop-only">
            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link to="/admin" style={{ marginRight: '15px', color: '#C9A84C', fontWeight: 'bold', textDecoration: 'none' }}>
                    ⚙️ Admin
                  </Link>
                )}
                <Link to="/profile" className="navbar-username" style={{ textDecoration: 'none' }}>
                  Salam, {user.fullName}
                </Link>
                <button type="button" className="navbar-logout" onClick={logout}>Çıxış</button>
              </>
            ) : (
              <>
                <Link to="/profile" className="navbar-login">👤 Şəxsi Kabinet</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Side Menu Drawer */}
      <div className={`side-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} />
      <div className={`side-menu-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="side-menu-header">
          <span className="side-menu-title">Menyu</span>
          <button className="side-menu-close" onClick={toggleMenu}>×</button>
        </div>
        <div className="side-menu-content">
          <ul className="side-menu-list">
            {user ? (
              <li className="side-menu-profile-box">
                <Link to="/profile" onClick={toggleMenu} style={{ textDecoration: 'none' }}>
                  <div className="side-profile-info">
                    <div className="side-profile-avatar">👤</div>
                    <div className="side-profile-text">
                      <span className="side-profile-name">{user.fullName}</span>
                      <span className="side-profile-sub">Hesabı idarə et</span>
                    </div>
                  </div>
                </Link>
              </li>
            ) : (
              <li className="side-menu-profile-box guest">
                 <Link to="/profile" onClick={toggleMenu} style={{ textDecoration: 'none' }}>
                  <div className="side-profile-info">
                    <div className="side-profile-avatar">🏠</div>
                    <div className="side-profile-text">
                      <span className="side-profile-name">Xoş gəlmisiniz</span>
                      <span className="side-profile-sub">Kabinetə daxil olun</span>
                    </div>
                  </div>
                </Link>
              </li>
            )}
            <li>
              <div className="side-menu-info">
                🏠 Saytda cəmi elan: <span className="stat-badge">{stats.total}</span>
              </div>
            </li>
            <hr className="side-menu-sep" />
            
            <li className="mobile-only">
              <Link to="/elan/yerlesdir" onClick={toggleMenu} className="side-menu-new-listing">
                ✨ + Elan ver
              </Link>
            </li>
            <li className="mobile-only">
              <Link to="/agencies" onClick={toggleMenu} className="side-menu-new-listing">
                🏢 Agentliklər üçün elan ver
              </Link>
            </li>
            <li className="mobile-only"><Link to="/elan?type=rent" onClick={toggleMenu}>🔑 Kirayə</Link></li>
            <li className="mobile-only"><Link to="/favorites" onClick={toggleMenu}>❤️ Seçilmişlər</Link></li>
            <li className="mobile-only"><Link to="/map" onClick={toggleMenu}>🗺️ Xəritə</Link></li>
            <hr className="side-menu-sep mobile-only" />

            <li><Link to="/about" onClick={toggleMenu}>📄 Layihə haqda</Link></li>
            <li><Link to="/terms" onClick={toggleMenu}>⚖️ İstifadəçi razılaşması</Link></li>
            <li><Link to="/rules" onClick={toggleMenu}>📜 Qaydalar</Link></li>
            <li><Link to="/privacy" onClick={toggleMenu}>🔒 Məxfilik siyasəti</Link></li>
            <li><Link to="/advertise" onClick={toggleMenu} className="side-menu-promo">📢 Reklam yerləşdirin <span className="new-tag">yeni</span></Link></li>
            <hr className="side-menu-sep" />
            <li><button className="side-lang-btn">🇷🇺 Русский язык</button></li>
          </ul>
          
          <div className="side-menu-footer">
            {user ? (
               <button onClick={() => { logout(); toggleMenu(); }} className="side-logout-btn">Çıxış ({user.fullName})</button>
            ) : (
                <Link to="/profile" onClick={toggleMenu} className="side-login-btn">👤 Şəxsi Kabinetə Giriş</Link>
            )}
            <p className="side-footer-title" style={{ marginTop: '20px' }}>Bizimlə əlaqə</p>
            <a href="tel:0125269494" className="side-footer-link">(012) 526-94-94</a>
            <a href="mailto:info@naxev.az" className="side-footer-link">info@naxev.az</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;