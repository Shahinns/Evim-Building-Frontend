import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { GoogleMapView } from "../components/GoogleMapView";
import { API_BASE } from "../config/api";
import "../styles/MapSearchPage.css";

const CITIES = {
  baku: { coords: { lat: 40.4093, lng: 49.8671 }, zoom: 12 },
  nakhchivan: { coords: { lat: 39.2089, lng: 45.4122 }, zoom: 13 }
};

export default function MapSearchPage() {
  const [listings, setListings]   = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [activeCity, setActiveCity] = useState("baku");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch]       = useState("");
  const [maxPrice, setMaxPrice]   = useState("");
  const [rooms, setRooms]         = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/buildings`)
      .then(r => r.json())
      .then(data => {
        const withCoords = (Array.isArray(data) ? data : [])
          .filter(d => d.latitude && d.longitude);
        setListings(withCoords);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let res = [...listings];
    res = res.filter(d => {
      const lat = Number(d.latitude);
      const lng = Number(d.longitude);
      const unvan = d.unvan?.toLowerCase() || "";
      if (activeCity === "baku") {
        const isBakuCoord = lat >= 40.0 && lat <= 40.6 && lng >= 49.4 && lng <= 50.3;
        const isBakuText = unvan.includes("bak") || unvan.includes("baku");
        return isBakuCoord || isBakuText;
      }
      const isNakhCoord = lat >= 38.8 && lat <= 39.8 && lng >= 44.5 && lng <= 46.2;
      const isNakhText = unvan.includes("nax") || unvan.includes("naxçıvan") || unvan.includes("naxcivan");
      return isNakhCoord || isNakhText;
    });
    if (typeFilter) res = res.filter(d => d.satIcare === typeFilter);
    if (rooms) {
      if (rooms === "5+") res = res.filter(d => d.otaqSayi >= 5);
      else res = res.filter(d => String(d.otaqSayi) === rooms);
    }
    if (maxPrice) res = res.filter(d => d.qiymet <= Number(maxPrice));
    if (search) res = res.filter(d =>
      d.unvan?.toLowerCase().includes(search.toLowerCase()) ||
      d.emlakTipi?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(res);
    setSelected(null);
  }, [activeCity, typeFilter, rooms, maxPrice, search, listings]);

  const handleCityChange = (cityKey) => {
    setActiveCity(cityKey);
    setSelected(null);
  };

  const fullImg = (url) =>
    !url ? "https://placehold.co/400x260/f4f4f2/999?text=Şəkil+yoxdur"
    : url.startsWith("http") ? url : `${API_BASE}${url}`;

  const markers = filtered.map(item => ({
    id: item.id,
    lat: Number(item.latitude),
    lng: Number(item.longitude),
    title: `${item.otaqSayi} otaqlı ${item.emlakTipi}`,
  }));

  const city = CITIES[activeCity];

  return (
    <div className="msp-page">
      <Navbar />
      <div className="msp-container-full">
        {isCollapsed ? (
          <button 
            type="button" 
            className="msp-mini-toggle-btn"
            onClick={() => setIsCollapsed(false)}
            aria-label="Filtrləri aç"
          >
            🔍 Filtrlər ({loading ? "..." : filtered.length}) ▾
          </button>
        ) : (
          <div className="msp-floating-panel">
            <div className="msp-panel-header">
              <h1 className="msp-main-title">Xəritədə axtar</h1>
              <button 
                type="button" 
                className="msp-panel-collapse-btn" 
                onClick={() => setIsCollapsed(true)}
                title="Xəritəni tam görmək üçün paneli yığ"
                aria-label="Paneli yığ"
              >
                ▲
              </button>
            </div>
            <div className="msp-type-toggle" style={{ marginBottom: "0.6rem", background: "#e2e8f0", padding: "3px" }}>
              <button className={`msp-toggle-btn ${activeCity === "baku" ? "active" : ""}`} onClick={() => handleCityChange("baku")} style={{ fontWeight: "bold" }}>Bakı</button>
              <button className={`msp-toggle-btn ${activeCity === "nakhchivan" ? "active" : ""}`} onClick={() => handleCityChange("nakhchivan")} style={{ fontWeight: "bold" }}>Naxçıvan</button>
            </div>
            <div className="msp-type-toggle">
              <button className={`msp-toggle-btn ${typeFilter === "" ? "active" : ""}`} onClick={() => setTypeFilter("")}>Hamısı</button>
              <button className={`msp-toggle-btn ${typeFilter === "SATIS" ? "active" : ""}`} onClick={() => setTypeFilter("SATIS")}>Satış</button>
              <button className={`msp-toggle-btn ${typeFilter === "KİRAYƏ" ? "active" : ""}`} onClick={() => setTypeFilter("KİRAYƏ")}>Kirayə</button>
            </div>
            <div className="msp-room-row">
              {["1","2","3","4","5+"].map(r => (
                <button key={r} className={`msp-room-btn ${rooms === r ? "active" : ""}`} onClick={() => setRooms(rooms === r ? "" : r)}>{r}</button>
              ))}
              <span className="msp-room-label">otaq</span>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ünvan axtar..."
              className="msp-search-input"
            />
            <div className="msp-floating-count">
              {loading ? "Yüklənir..." : `${filtered.length} elan tapıldı`}
            </div>
          </div>
        )}

        <div className="msp-map-full">
          <GoogleMapView
            latitude={selected ? selected.latitude : city.coords.lat}
            longitude={selected ? selected.longitude : city.coords.lng}
            zoom={selected ? 16 : city.zoom}
            height="100%"
            markers={markers}
            selectedId={selected?.id}
            onMarkerClick={(m) => {
              const item = filtered.find(d => d.id === m.id);
              setSelected(item || null);
              setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 200);
            }}
          />
        </div>

        {selected && (
          <div className="msp-mobile-card-wrapper" ref={cardRef}>
            <div className="msp-mobile-card">
              <button className="msp-card-close" onClick={() => setSelected(null)}>✖</button>
              <Link to={`/elan/${selected.id}`} className="msp-mobile-card-content">
                <img src={fullImg(selected.imageUrls?.[0])} alt={selected.emlakTipi} className="msp-m-img" />
                <div className="msp-m-info">
                  <div className="msp-m-price">{selected.qiymet?.toLocaleString()} ₼</div>
                  <div className="msp-m-title">{selected.otaqSayi} otaqlı {selected.emlakTipi}</div>
                  <div className="msp-m-loc">📍 {selected.unvan}</div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
