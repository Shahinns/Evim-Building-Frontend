import React from "react";
import Navbar from "../components/Navbar";
import Listings from "../components/Listings";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="page favorites-page">
      <Navbar />
      <div className="nax-wrapper" style={{ minHeight: '80vh', paddingTop: '2rem' }}>
        <div className="nax-container">
          <div className="nax-section-header">
            <span className="nax-section-icon">❤️</span>
            <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem" }}>Seçilmiş Elanlar</h2>
          </div>

          {favorites.length > 0 ? (
            <Listings data={favorites} />
          ) : (
            <div className="empty-favorites" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤍</div>
              <h3 style={{ fontSize: '1.5rem', color: '#1A1A1A' }}>Hələ ki, heç bir elan seçilməyib.</h3>
              <p style={{ color: '#6B6560', marginBottom: '2rem' }}>Bəyəndiyiniz elanları ürək düyməsinə basaraq burada saxlaya bilərsiniz.</p>
              <Link to="/" className="navbar-new-listing" style={{ display: 'inline-block' }}>
                Elanlara bax
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
