import React from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config/api";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import "../styles/Listings.css"; 

function getAllImages(item) {
  const urls = item.imageUrls || [];
  if (Array.isArray(urls) && urls.length > 0) {
    return urls.map(u => u.startsWith("http") ? u : `${API_BASE}${u}`);
  }
  return item.imageUrl ? [item.imageUrl.startsWith("http") ? item.imageUrl : `${API_BASE}${item.imageUrl}`] : [];
}

import { useFavorites } from "../context/FavoritesContext";

function ListingCard({ item, onMakeVip }) {
  const images = getAllImages(item);
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(item.id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  };

  return (
    <Link to={`/elan/${item.id}`} className={`nax-card ${item.premium ? "nax-card--premium" : ""}`} style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }}>
      <div className="nax-img-box">
        {item.premium && <div className="nax-premium-badge">PREMIUM</div>}
        <button 
          className={`nax-fav-btn ${favorite ? "active" : ""}`} 
          onClick={handleFavorite}
          title={favorite ? "Seçilmişlərdən sil" : "Seçilmişlərə əlavə et"}
        >
          {favorite ? "❤️" : "🤍"}
        </button>
        <img src={images[0]} alt="Naxçıvan Ev" className="nax-img" />
        <div className="nax-price-badge">{item.qiymet?.toLocaleString()} ₼</div>
        {item.hasExtract && <div className="nax-kupca">Çıxarış var</div>}
        {onMakeVip && !item.premium && (
          <button 
            className="nax-make-vip-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMakeVip(item.id);
            }}
            style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#d97706', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', zIndex: 10 }}
          >
            👑 VIP Et
          </button>
        )}
      </div>
      <div className="nax-info">
        <h3 className="nax-title">{item.otaqSayi} Otaqlı • {item.kvMetr} m²</h3>
        <p className="nax-loc">📍 {item.unvan || "Naxçıvan şəhəri"}</p>
        <div className="nax-meta">
          <span>{item.mertebe}/{item.binaninMertebeSayi} Mərtəbə</span>
          <span className="nax-tag">{item.emlakTipi || "Mənzil"}</span>
        </div>
      </div>
    </Link>
  );
}

function Listings({ data, onMakeVip }) {
  if (!data || !Array.isArray(data)) return null;

  const premiumListings = data.filter(item => item.premium);
  const normalListings = data.filter(item => !item.premium);

  return (
    <div className="nax-wrapper">
      <div className="nax-container">
        
        {premiumListings.length > 0 && (
          <div className="nax-section">
            <div className="nax-section-header nax-section-header--premium">
              <span className="nax-section-icon">⭐</span>
              <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color: "#d97706" }}>Premium Elanlar</h2>
            </div>
            <div className="nax-grid">
              {premiumListings.map(item => (
                <ListingCard key={item.id} item={item} onMakeVip={onMakeVip} />
              ))}
            </div>
          </div>
        )}

        {premiumListings.length > 0 && normalListings.length > 0 && (
          <hr className="nax-section-divider" />
        )}

        {normalListings.length > 0 && (
          <div className="nax-section">
            <div className="nax-section-header nax-section-header--all">
              <h2>{premiumListings.length > 0 ? "Digər elanlar" : "Elanlar"}</h2>
            </div>
            <div className="nax-grid">
              {normalListings.map(item => (
                <ListingCard key={item.id} item={item} onMakeVip={onMakeVip} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Listings;