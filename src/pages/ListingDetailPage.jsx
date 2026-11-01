import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PropertyMap from "../components/PropertyMap";
import { API_BASE } from "../config/api";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useFavorites } from "../context/FavoritesContext";
import "../styles/ListingDetail.css";
import SimilarListings from "../components/SimilarListings";

export default function ListingDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_BASE}/api/buildings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Elan tapılmadı");
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="detail-loading">Yüklənir...</div>;
  if (error) return <div className="detail-error">{error}</div>;
  if (!item) return null;

  const images = item.imageUrls || [];
  const fullImages = images.map(u => u.startsWith("http") ? u : `${API_BASE}${u}`);
  const favorite = isFavorite(item.id);

  const formatPhoneForWA = (num) => {
    if (!num) return "";
    let cleaned = num.replace(/\D/g, "");
    if (cleaned.startsWith("994")) return cleaned;
    if (cleaned.startsWith("0")) {
      cleaned = "994" + cleaned.substring(1);
    } else if (cleaned.length === 9) {
      cleaned = "994" + cleaned;
    }
    return cleaned;
  };

  const currentUrl = window.location.href;
  const whatsappNumber = formatPhoneForWA(item.whatsapp || item.phone);
  const telNumber = item.phone?.replace(/\D/g, "");
  const waPrefillText = `Salam, NaxEv.az-da bu elanla maraqlanıram:\n${currentUrl}`;
  const waContactHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waPrefillText)}`
    : null;

  // 🔹 Paylaşma funksiyaları
  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => alert("Link kopyalandı!"))
      .catch(() => alert("Kopyalama alınmadı"));
  };
  const shareWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="page listing-detail-page">
      <Navbar />
      
      <div className="detail-container">
        <div className="detail-breadcrumb">
          <Link to="/">Ana Səhifə</Link> / <span>{item.otaqSayi} Otaqlı {item.emlakTipi}</span>
        </div>

        <div className="detail-layout">
          <div className="detail-gallery">
            <div className="detail-main-img">
              {item.premium && <div className="detail-premium-badge">PREMIUM</div>}
              <button 
                className={`detail-fav-btn ${favorite ? "active" : ""}`}
                onClick={() => toggleFavorite(item)}
                title={favorite ? "Seçilmişlərdən sil" : "Seçilmişlərə əlavə et"}
                type="button"
              >
                <span className="detail-fav-icon" aria-hidden>{favorite ? "❤️" : "🤍"}</span>
                <span className="detail-fav-label">{favorite ? "Seçilmişlərdədir" : "Seçilmişlərə əlavə et"}</span>
              </button>
              <PhotoProvider>
                <PhotoView src={fullImages[activeImg]}>
                  <img src={fullImages[activeImg]} alt="Emlak" />
                </PhotoView>
              </PhotoProvider>
            </div>
            <div className="detail-thumbs">
              {fullImages.map((img, i) => (
                <div 
                  key={i} 
                  className={`detail-thumb ${activeImg === i ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`Thumbnail ${i}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="detail-info">
            <div className="detail-header">
              <div className="detail-price">{item.qiymet?.toLocaleString()} ₼</div>
              <h1 className="detail-title">{item.otaqSayi} Otaqlı {item.emlakTipi}</h1>
              <p className="detail-location">
                📍 {item.unvan} 
                <a href="#property-map" className="map-scroll-hint map-scroll-hint--long">
                  (Aşağıya sürüşdürüb xəritədən daha dəqiq yerə baxın)
                </a>
                <a href="#property-map" className="map-scroll-hint map-scroll-hint--short">
                  Xəritəyə keç →
                </a>
              </p>
            </div>

            <div className="detail-specs">
              <div className="spec-item">
                <span className="spec-label">Sahə</span>
                <span className="spec-value">{item.kvMetr} m²</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Otaq sayı</span>
                <span className="spec-value">{item.otaqSayi}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Mərtəbə</span>
                <span className="spec-value">{item.mertebe} / {item.binaninMertebeSayi}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Təmir</span>
                <span className="spec-value">{item.temir}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Binanın növü</span>
                <span className="spec-value">
                  {item.buildingType === "YENI" ? "Yeni tikili" : 
                   item.buildingType === "KOHNE" ? "Köhnə tikili" : "-"}
                </span>
              </div>
            </div>

            <div className="detail-features">
              {item.lift && <span className="feature-tag">Lift var</span>}
              {item.hasar && <span className="feature-tag">Həyət evi</span>}
              {item.parking && <span className="feature-tag">Parking</span>}
            </div>

            <div className="detail-description">
              <h3>Əlavə məlumat</h3>
              <p style={{ whiteSpace: "pre-line" }}>{item.description || "Bu elan üçün əlavə məlumat daxil edilməyib."}</p>
            </div>

            <div className="detail-contact">
              <h3>Satıcı ilə əlaqə</h3>
              <div className="contact-buttons">
                <a
                  href={telNumber ? `tel:${telNumber}` : "#"}
                  className={`contact-btn call${!telNumber ? " contact-btn--disabled" : ""}`}
                  aria-disabled={!telNumber}
                  onClick={!telNumber ? (e) => e.preventDefault() : undefined}
                >
                  <span className="icon">📞</span>
                  <div className="btn-text-row">
                    <span>Zəng et:</span>
                    <strong>{item.phone || "—"}</strong>
                  </div>
                </a>
                <a 
                  href={waContactHref || "#"}
                  target="_blank" 
                  rel="noreferrer" 
                  className={`contact-btn whatsapp${!waContactHref ? " contact-btn--disabled" : ""}`}
                  aria-disabled={!waContactHref}
                  onClick={!waContactHref ? (e) => e.preventDefault() : undefined}
                >
                  <span className="icon">💬</span>
                  <div className="btn-text">
                    <span>WhatsApp ilə yaz</span>
                  </div>
                </a>
              </div>
            </div>

            {/* 🔹 Paylaşma düymələri */}
            <div className="detail-share">
              <h3>Elanı paylaş</h3>
              <div className="share-buttons">
                <button onClick={copyLink} className="share-btn">🔗 Linki kopyala</button>
                <button onClick={shareWhatsApp} className="share-btn whatsapp">📱 WhatsApp ilə paylaş</button>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-map-section" id="property-map">
          <h3>Xəritədə yeri</h3>
          <div className="detail-map-box">
            <PropertyMap 
              latitude={item.latitude} 
              longitude={item.longitude} 
              address={item.unvan}
            />
          </div>
        </div>

        <SimilarListings currentItem={item} />
      </div>

      <div className="detail-mobile-bar" role="toolbar" aria-label="Satıcı ilə əlaqə">
        <a
          href={telNumber ? `tel:${telNumber}` : "#"}
          className={`detail-mbar-btn detail-mbar-call${!telNumber ? " is-disabled" : ""}`}
          aria-disabled={!telNumber}
          onClick={!telNumber ? (e) => e.preventDefault() : undefined}
        >
          <span className="detail-mbar-icon" aria-hidden>📞</span>
          <span className="detail-mbar-text">Zəng</span>
        </a>
        <a
          href={waContactHref || "#"}
          target="_blank"
          rel="noreferrer"
          className={`detail-mbar-btn detail-mbar-wa${!waContactHref ? " is-disabled" : ""}`}
          aria-disabled={!waContactHref}
          onClick={!waContactHref ? (e) => e.preventDefault() : undefined}
        >
          <span className="detail-mbar-icon" aria-hidden>💬</span>
          <span className="detail-mbar-text">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
