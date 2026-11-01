import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/Authcontext";
import { API_BASE } from "../config/api";
import { 
  NAXCIVAN_AREAS, 
  BAKU_RAYONS, 
  BAKU_METROS, 
  BAKU_QESEBELER 
} from "../components/FilterDrawer";
import "../styles/CreateListing.css";

// Şəhərlərin Mərkəzi Koordinatları
const CITY_CENTERS = {
  Naxçıvan: [39.2092, 45.4128],
  Bakı: [40.4093, 49.8671],
};

const MAX_IMAGES = 10;

const EMPTY = {
  emlakTipi: "Mənzil",
  otaqSayi: "",
  qiymet: "",
  unvan: "",
  satIcare: "SATIS",
  kvMetr: "",
  mertebe: "",
  binaninMertebeSayi: "",
  temir: "Təmirli",
  buildingType: "",
  yashayisSahesi: "",
  lift: false,
  hasar: false,
  parking: false,
  latitude: null,
  longitude: null,
  premium: false,
  description: "",
  phone: "",
  whatsapp: "",
  email: "",
  fullName: "",
};

function MapPicker({ lat, lng, city, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [hint, setHint] = useState("Dəqiq konumu seçmək üçün xəritəyə klikləyin");

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (!window.L) {
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          s.onload = res;
          s.onerror = rej;
          document.head.appendChild(s);
        });
      }

      if (!isMounted || !containerRef.current) return;
      if (mapRef.current) return;

      const L = window.L;
      const initialCenter = lat && lng ? [lat, lng] : (CITY_CENTERS[city] || CITY_CENTERS.Naxçıvan);
      const map = L.map(containerRef.current, { center: initialCenter, zoom: 12 });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (e) => {
        const { lat: la, lng: lo } = e.latlng;
        setHint(`📍 Seçildi: ${la.toFixed(5)}, ${lo.toFixed(5)}`);
        onSelect({ latitude: la, longitude: lo });
      });

      mapRef.current = map;
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    const L = window.L;

    const targetCenter = lat && lng ? [lat, lng] : (CITY_CENTERS[city] || CITY_CENTERS.Naxçıvan);
    mapRef.current.setView(targetCenter, 13);

    if (lat && lng) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);
        markerRef.current.on("dragend", (e) => {
          const { lat: dLa, lng: dLo } = e.target.getLatLng();
          setHint(`📍 Seçildi: ${dLa.toFixed(5)}, ${dLo.toFixed(5)}`);
          onSelect({ latitude: dLa, longitude: dLo });
        });
      }
      setHint(`📍 Seçildi: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      setHint("Dəqiq konumu seçmək üçün xəritəyə klikləyin");
    }
  }, [city, lat, lng]);

  return (
    <div className="cl-map-wrapper">
      <div ref={containerRef} className="cl-map" />
      <p className="cl-map-hint">{hint}</p>
    </div>
  );
}

export default function CreateListingPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [selectedCity, setSelectedCity] = useState("Naxçıvan");
  const [premiumDuration, setPremiumDuration] = useState("30");
  const [showPayment, setShowPayment] = useState(false);

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showVerify, setShowVerify] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");

  useEffect(() => {
    if (user && user.email) {
      setForm((f) => ({ ...f, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    if (form.unvan) {
      if (
        BAKU_RAYONS.includes(form.unvan) ||
        BAKU_METROS.includes(form.unvan) ||
        BAKU_QESEBELER.includes(form.unvan)
      ) {
        setSelectedCity("Bakı");
      } else if (NAXCIVAN_AREAS.includes(form.unvan)) {
        setSelectedCity("Naxçıvan");
      }
    }
  }, [form.unvan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleMapSelect = ({ latitude, longitude }) => {
    setForm((f) => ({ ...f, latitude, longitude }));
    setError("");
  };

  const handleFiles = (e) => {
    const list = Array.from(e.target.files || []).slice(0, MAX_IMAGES);
    setFiles(list);
    setPreviews((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return list.map((f) => URL.createObjectURL(f));
    });
    setError("");
  };

  const handlePremiumSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.unvan) {
      setError("Zəhmət olmasa ünvanı daxil edin.");
      return;
    }
    if (!form.latitude || !form.longitude) {
      setError("Zəhmət olmasa əmlakın yerini xəritədə qeyd edin.");
      return;
    }

    if (!user) {
      if (!form.phone) {
        setError("Telefon nömrəsi daxil edilməlidir.");
        return;
      }
      if (!form.email) {
        setError("Email daxil edilməlidir.");
        return;
      }
    }

    const currentToken = localStorage.getItem("emlak_token");
    let tokenEmail = null;
    let isExpired = false;
    if (currentToken) {
      try {
        const payload = JSON.parse(atob(currentToken.split(".")[1]));
        tokenEmail = payload.sub;
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          isExpired = true;
        }
      } catch (e) {
        tokenEmail = null;
        isExpired = true;
      }
    }

    const needsVerification = !currentToken || isExpired || (tokenEmail && tokenEmail !== form.email);

    if (needsVerification) {
      if (currentToken && (isExpired || (tokenEmail && tokenEmail !== form.email))) {
        localStorage.removeItem("emlak_token");
        if (window.logout) window.logout();
      }

      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/auth/quick-register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: form.email, phone: form.phone, fullName: form.fullName }),
        });
        const raw = await res.text();
        let data = {};
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          data = {};
        }
        if (!res.ok) throw new Error(data?.message || "Xəta baş verdi");
        setShowVerify(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    submitListing();
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: form.email, code: verifyCode }),
      });
      const raw = await res.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }
      if (!res.ok) throw new Error(data?.message || "Kod yanlışdır");

      if (data.token) {
        localStorage.setItem("emlak_token", data.token);
      }
      if (login) login(data);

      setShowVerify(false);
      setTimeout(() => {
        handlePremiumSubmit();
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitListing = async () => {
    const activeToken = localStorage.getItem("emlak_token");
    setLoading(true);
    setError("");
    try {
      const imageUrls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch(`${API_BASE}/api/buildings/upload-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${activeToken}` },
          credentials: "include",
          body: fd,
        });
        const raw = await res.text();
        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch {
          data = null;
        }
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("emlak_token");
            throw new Error("Giriş müddətiniz bitib. Zəhmət olmasa təsdiq kodunu yenidən daxil edin.");
          }
          throw new Error(data?.message || "Şəkil yüklənmədi");
        }
        if (!data?.url) throw new Error("Server şəkil URL-i qaytarmadı");
        imageUrls.push(data.url);
      }

      const body = {
        emlakTipi: form.emlakTipi,
        otaqSayi: Number(form.otaqSayi),
        qiymet: Number(form.qiymet),
        unvan: form.unvan,
        satIcare: form.satIcare,
        kvMetr: Number(form.kvMetr),
        mertebe: Number(form.mertebe),
        binaninMertebeSayi: form.emlakTipi === "Həyət evi" ? null : (form.binaninMertebeSayi ? Number(form.binaninMertebeSayi) : null),
        temir: form.temir || null,
        yashayisSahesi: form.yashayisSahesi === "" ? null : Number(form.yashayisSahesi),
        lift: Boolean(form.lift),
        hasar: Boolean(form.hasar),
        parking: Boolean(form.parking),
        latitude: form.latitude,
        longitude: form.longitude,
        premium: Boolean(form.premium),
        description: form.description,
        phone: form.phone,
        whatsapp: form.whatsapp,
        buildingType: form.buildingType,
        imageUrls,
      };

      const res2 = await fetch(`${API_BASE}/api/buildings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res2.ok) {
        let errData = {};
        try {
          errData = await res2.json();
        } catch (e) {}
        throw new Error(
          errData.message || "Elan saxlanılmadı, 10 elandan sonra elan yerləşdirmək üçün agentlik və ya makler hesabı açmalısınız."
        );
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
      setShowPayment(false);
    }
  };

  const premiumPrice = premiumDuration === "30" ? 20 : 12;

  return (
    <div className="page create-listing-page">
      <Navbar />
      <div className="create-listing-wrap">
        <header className="create-listing-head">
          <h1>Yeni elan yerləşdir</h1>
          <p>Əmlak məlumatlarını doldurun və şəkil əlavə edin.</p>
        </header>

        <form className="create-listing-form" onSubmit={handlePremiumSubmit}>
          <div className="cl-grid">
            <div className="cl-field">
              <label>Əmlak növü</label>
              <select name="emlakTipi" value={form.emlakTipi} onChange={handleChange}>
                <option value="Mənzil">Mənzil</option>
                <option value="Həyət evi">Həyət evi</option>
                <option value="Ofis">Ofis</option>
                <option value="Obyekt">Obyekt</option>
              </select>
            </div>

            <div className="cl-field">
              <label>Əməliyyat</label>
              <select name="satIcare" value={form.satIcare} onChange={handleChange}>
                <option value="SATIS">Satış</option>
                <option value="KİRAYƏ">Kirayə</option>
              </select>
            </div>

            <div className="cl-field">
              <label>
                Qiymət (₼) {form.satIcare === "KİRAYƏ" ? " / ay" : ""}
              </label>
              <input
                name="qiymet"
                type="number"
                min={0}
                step="0.01"
                value={form.qiymet}
                onChange={handleChange}
                required
                placeholder={form.satIcare === "KİRAYƏ" ? "Məs: 500 ₼ / ay" : "Məs: 50,000 ₼"}
              />
            </div>

            <div className="cl-field">
              <label>Otaq sayı</label>
              <input name="otaqSayi" type="number" min={1} value={form.otaqSayi} onChange={handleChange} required />
            </div>

            {/* 📍 ŞƏHƏR SEÇİMİ VƏ XƏRİTƏ */}
            <div className="cl-field cl-span-2">
              <label style={{ fontWeight: "600", marginBottom: "8px", display: "block" }}>
                📍 Şəhər / Region seçin
              </label>

              <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity("Naxçıvan");
                    setForm((f) => ({ ...f, unvan: "", latitude: null, longitude: null }));
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    textAlign: "center",
                    fontWeight: "600",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: selectedCity === "Naxçıvan" ? "#007bff" : "#f8f9fa",
                    color: selectedCity === "Naxçıvan" ? "#fff" : "#333",
                    transition: "all 0.2s",
                  }}
                >
                  📍 Naxçıvan
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity("Bakı");
                    setForm((f) => ({ ...f, unvan: "", latitude: null, longitude: null }));
                  }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    textAlign: "center",
                    fontWeight: "600",
                    cursor: "pointer",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: selectedCity === "Bakı" ? "#007bff" : "#f8f9fa",
                    color: selectedCity === "Bakı" ? "#fff" : "#333",
                    transition: "all 0.2s",
                  }}
                >
                  🏙️ Bakı
                </button>
              </div>

              <label style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
                {selectedCity === "Naxçıvan" ? "Naxçıvan Ərazisini seçin *" : "Bakı Ərazisini / Metrosunu seçin *"}
              </label>

              <div className="cl-location-combined">
                {selectedCity === "Naxçıvan" ? (
                  <select
                    name="unvan"
                    value={form.unvan}
                    onChange={handleChange}
                    className="cl-input"
                    required
                  >
                    <option value="">Naxçıvan ərazisini seçin...</option>
                    {NAXCIVAN_AREAS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    name="unvan"
                    value={form.unvan}
                    onChange={handleChange}
                    className="cl-input"
                    required
                  >
                    <option value="">Bakı ərazisini / metrosunu seçin...</option>
                    <optgroup label="🏙️ BAKI RAYONLARI">
                      {BAKU_RAYONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🚇 BAKI METROLARI">
                      {BAKU_METROS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🏡 QƏSƏBƏLƏR VƏ ƏRAZİLƏR">
                      {BAKU_QESEBELER.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                )}

                <div className="cl-map-container" style={{ marginTop: "15px" }}>
                  <label
                    className="cl-sub-label"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#d32f2f",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                    }}
                  >
                    Xəritədə dəqiq yeri qeyd edin (Məcburidir):
                  </label>
                  <MapPicker
                    lat={form.latitude}
                    lng={form.longitude}
                    city={selectedCity}
                    onSelect={handleMapSelect}
                  />
                </div>
              </div>
            </div>

            <div className="cl-field">
              <label>Sahə (m²)</label>
              <input name="kvMetr" type="number" min={1} step="0.1" value={form.kvMetr} onChange={handleChange} required />
            </div>

            <div className="cl-field">
              <label>Yaşayış sahəsi (m²)</label>
              <input
                name="yashayisSahesi"
                type="number"
                min={0}
                step="0.1"
                value={form.yashayisSahesi}
                onChange={handleChange}
                placeholder="İstəyə bağlı"
              />
            </div>

            {/* MƏRTƏBƏ NÖVÜNƏ UĞURAN DƏYİŞƏN HİSSƏ */}
            <div className="cl-field">
              <label>{form.emlakTipi === "Həyət evi" ? "Mərtəbə sayı" : "Mərtəbə"}</label>
              <input name="mertebe" type="number" min={1} value={form.mertebe} onChange={handleChange} required />
            </div>

            {form.emlakTipi !== "Həyət evi" && (
              <div className="cl-field">
                <label>Binanın mərtəbə sayı</label>
                <input
                  name="binaninMertebeSayi"
                  type="number"
                  min={1}
                  value={form.binaninMertebeSayi}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="cl-field">
              <label>Tikili növü</label>
              <select name="buildingType" value={form.buildingType} onChange={handleChange}>
                <option value="">Seçin...</option>
                <option value="YENI">Yeni tikili</option>
                <option value="KOHNE">Köhnə tikili</option>
              </select>
            </div>

            <div className="cl-field">
              <label>Təmir</label>
              <select name="temir" value={form.temir} onChange={handleChange}>
                <option value="Təmirli">Təmirli</option>
                <option value="Təmirsiz">Təmirsiz</option>
              </select>
            </div>

            <div className="cl-field" style={{ display: "flex", alignItems: "center" }}>
              <label className="cl-check" style={{ marginTop: "20px" }}>
                <input type="checkbox" name="premium" checked={form.premium} onChange={handleChange} />
                Premium elan ✨
              </label>
            </div>
          </div>

          {form.premium && (
            <div
              className="premium-options-box"
              style={{
                background: "#FFF9E6",
                padding: "1.2rem 1.5rem",
                borderRadius: "12px",
                border: "2px solid #F59E0B",
                margin: "1rem 0",
              }}
            >
              <h3 style={{ margin: "0 0 0.4rem", color: "#B45309" }}>Açılış Kampaniyası ✨</h3>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#92400E", lineHeight: "1.5" }}>
                Saytımızın fəaliyyətə başlaması münasibətilə <strong>Premium elan yerləşdirmək tamamilə ödənişsizdir!</strong> Elanınız axtarış nəticələrində ən yuxarıda görünəcək.
              </p>
            </div>
          )}

          <div className="cl-checks">
            {form.emlakTipi !== "Həyət evi" && (
              <label className="cl-check">
                <input type="checkbox" name="lift" checked={form.lift} onChange={handleChange} /> Lift
              </label>
            )}
            <label className="cl-check">
              <input type="checkbox" name="parking" checked={form.parking} onChange={handleChange} /> Parking
            </label>
          </div>

          <div className="cl-extra-info">
            <div className="cl-field cl-span-2">
              <label>Əlavə məlumat</label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                className="cl-textarea"
                placeholder="Ev haqqında ətraflı məlumat..."
              ></textarea>
            </div>

            {!user && (
              <>
                <div className="cl-field">
                  <label>Əlaqə nömrəsi</label>
                  <input name="phone" type="text" value={form.phone} onChange={handleChange} required placeholder="Məs: 050 123 45 67" />
                </div>
                <div className="cl-field">
                  <label>Emailiniz</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Məs: adiniz@email.com" />
                </div>
                <div className="cl-field">
                  <label>Ad və Soyadınız (İstəyə bağlı)</label>
                  <input name="fullName" type="text" value={form.fullName} onChange={handleChange} placeholder="Məs: Əli Vəliyev" />
                </div>
              </>
            )}
          </div>

          <div className="cl-images">
            <label className="cl-images-label">Şəkillər (ən çox {MAX_IMAGES})</label>
            <input type="file" multiple onChange={handleFiles} />
            <div className="cl-previews">
              {previews.map((src) => (
                <img key={src} src={src} alt="" className="cl-preview-thumb" />
              ))}
            </div>
          </div>

          {error && <p className="create-listing-error">{error}</p>}

          <div className="create-listing-actions">
            <Link to="/" className="cl-btn cl-btn-ghost">
              Ləğv et
            </Link>
            <button type="submit" className="cl-btn cl-btn-primary" disabled={loading}>
              {loading ? "Gözləyin..." : "Elanı yerləşdir"}
            </button>
          </div>
        </form>
      </div>

      {showVerify && (
        <div className="nax-modal-overlay">
          <div className="nax-modal-content" style={{ maxWidth: "400px", padding: "2rem", background: "#fff" }}>
            <button className="nax-close" onClick={() => setShowVerify(false)} style={{ color: "#000", fontWeight: "bold" }}>
              ×
            </button>
            <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#000", fontSize: "1.5rem", fontWeight: "800" }}>
              Email Təsdiqi
            </h2>
            <p style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "0.9rem", color: "#666" }}>
              {form.email} ünvanına göndərilən 6 rəqəmli kodu daxil edin.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input
                type="text"
                placeholder="Kod: 123456"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                style={{ width: "100%", padding: "12px", border: "2px solid #ddd", color: "#000", textAlign: "center", letterSpacing: "2px", fontSize: "1.2rem", fontWeight: "bold" }}
              />
              <button onClick={handleVerify} className="cl-btn cl-btn-primary" disabled={loading} style={{ width: "100%", padding: "15px", background: "#000", color: "#fff", fontWeight: "bold" }}>
                {loading ? "Yoxlanılır..." : "Təsdiqlə və Davam Et"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}