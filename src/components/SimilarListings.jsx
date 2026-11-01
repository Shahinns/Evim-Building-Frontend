import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config/api";
import "../styles/SimilarListings.css";

export default function SimilarListings({ currentItem }) {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentItem) return;
    setLoading(true);

    // Oxşar elanları tap: eyni satIcare + yaxın qiymət (%40 aralıq) + eyni olmayan id
    const params = new URLSearchParams();
    if (currentItem.satIcare) params.append("satIcare", currentItem.satIcare);
    if (currentItem.otaqSayi) params.append("otaqSayi", currentItem.otaqSayi);

    fetch(`${API_BASE}/api/buildings/search?${params}`)
      .then(r => r.json())
      .then(data => {
        const results = (Array.isArray(data) ? data : [])
          .filter(d => d.id !== currentItem.id)   // özünü çıxar
          .filter(d => {                            // qiymət ±40%
            if (!currentItem.qiymet || !d.qiymet) return true;
            const ratio = d.qiymet / currentItem.qiymet;
            return ratio >= 0.6 && ratio <= 1.4;
          })
          .slice(0, 4);                             // max 4 elan
        setSimilar(results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentItem?.id]);

  const fullImg = (url) =>
    !url ? "https://placehold.co/400x260/f4f4f2/999?text=Şəkil+yoxdur"
    : url.startsWith("http") ? url : `${API_BASE}${url}`;

  if (loading) return null;
  if (similar.length === 0) return null;

  return (
    <section className="sim-section">
      <div className="sim-header">
        <h3 className="sim-title">Oxşar Elanlar</h3>
        <Link
          to={`/elan?type=${currentItem.satIcare === "SATIS" ? "sale" : "rent"}`}
          className="sim-see-all"
        >
          Hamısına bax →
        </Link>
      </div>

      <div className="sim-grid">
        {similar.map(item => (
          <Link key={item.id} to={`/elan/${item.id}`} className="sim-card">
            <div className="sim-img-wrap">
              <img
                src={fullImg(item.imageUrls?.[0])}
                alt={item.emlakTipi}
                className="sim-img"
              />
              <span className={`sim-badge ${item.satIcare === "SATIS" ? "sale" : "rent"}`}>
                {item.satIcare === "SATIS" ? "Satış" : "Kirayə"}
              </span>
              {item.premium && <span className="sim-premium">PREM</span>}
            </div>
            <div className="sim-body">
              <div className="sim-price">{item.qiymet?.toLocaleString()} ₼</div>
              <div className="sim-name">{item.otaqSayi} otaqlı {item.emlakTipi}</div>
              <div className="sim-loc">📍 {item.unvan}</div>
              <div className="sim-meta">
                <span>{item.kvMetr} m²</span>
                <span>·</span>
                <span>{item.mertebe}-ci mərtəbə</span>
                {item.temir && <><span>·</span><span>{item.temir}</span></>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}