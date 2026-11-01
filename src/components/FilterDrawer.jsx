import React, { useState, useEffect } from "react";
import "../styles/FilterDrawer.css";
import "../styles/Listings.css";

// 📍 DƏQİQ VƏ TAM ƏRAZİ SİYAHILARI
export const NAXCIVAN_AREAS = [
  "Mərkəz", "1-ci mikrorayon", "2-ci mikrorayon", "3-cü mikrorayon", 
  "4 yol ətrafı", "57 ərazisi", "Avtovağzal ətrafı", "Azərbaycan məhəlləsi", 
  "Cahan gənclər şəhərciyi", "Çuxur məhəlləsi", "Dairəvi yol ətrafı", 
  "Daxili qoşunlar ətrafı", "Əliabad", "Hacınıyyət", "Qaraçuq", 
  "Qaraxanbəyli", "Saat meydanı ətrafı", "Sabir küçəsi", "Şəhər daxili", 
  "Şəhər ətrafı", "Tumbul", "Ümid Gənclər şəhərciyi", "Xətai (Sovedabad)", "Yeni Naxçıvan"
];

export const BAKU_RAYONS = [
  "Abşeron r.", "Binəqədi r.", "Xətai r.", "Xəzər r.", 
  "Qaradağ r.", "Nərimanov r.", "Nəsimi r.", "Nizami r.", 
  "Pirallahı r.", "Sabunçu r.", "Səbail r.", "Suraxanı r.", "Yasamal r."
];

export const BAKU_METROS = [
  "20 Yanvar m.", "28 May m.", "8 Noyabr m.", "Avtovağzal m.", 
  "Azadlıq Prospekti m.", "Bakmil m.", "Dərnəgül m.", "Elmlər Akademiyası m.", 
  "Əhmədli m.", "Gənclik m.", "Həzi Aslanov m.", "İçərişəhər m.", 
  "İnşaatçılar m.", "Koroğlu m.", "Memar Əcəmi m.", "Neftçilər m.", 
  "Nəriman Nərimanov m.", "Nizami m.", "Qara Qarayev m.", "Sahil m.", 
  "Şah İsmayıl Xətai m.", "Ulduz m.", "Xalqlar Dostluğu m.", "Xocəsən m."
];

export const BAKU_QESEBELER = [
  "Ağ Şəhər", "Badamdar qəs.", "Bakıxanov qəs.", "Bayıl qəs.", 
  "Bilgəh qəs.", "Binə qəs.", "Buzovna qəs.", "Bülbülə qəs.", 
  "Əhmədli qəs.", "Hövsan qəs.", "Lökbatan qəs.", "Masazır qəs.", 
  "Mərdəkan qəs.", "Nardaran qəs.", "Rəsulzadə qəs.", "Şüvəlan qəs.", 
  "Tbilisi prospekti", "Xırdalan şəh.", "Yeni Yasamal", "Zabrat qəs.", "Zıx qəs."
];

// CreateListingPage üçün lazımi export
export const UNVAN_OPTIONS = [
  { value: "", label: "Hamısı" },
  ...NAXCIVAN_AREAS.map((item) => ({ value: item, label: item })),
  ...BAKU_RAYONS.map((item) => ({ value: item, label: item })),
  ...BAKU_METROS.map((item) => ({ value: item, label: item })),
  ...BAKU_QESEBELER.map((item) => ({ value: item, label: item })),
];

const TEMIR_OPTIONS = ["", "Təmirli", "Təmirsiz"];
const OTAQ_OPTIONS = [
  { label: "Hamısı", value: "" },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5+", value: 5 },
];

export default function BuildingSearch({ filters, onUpdate, onSearch, isOpen, onClose }) {
  const [selectedCity, setSelectedCity] = useState("Naxçıvan");

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Əgər evdən seçilmiş ünvan Bakıya aiddirsə, avtomatik Bakı tabını aktiv et
  useEffect(() => {
    if (filters.unvan) {
      if (
        BAKU_RAYONS.includes(filters.unvan) ||
        BAKU_METROS.includes(filters.unvan) ||
        BAKU_QESEBELER.includes(filters.unvan)
      ) {
        setSelectedCity("Bakı");
      } else if (NAXCIVAN_AREAS.includes(filters.unvan)) {
        setSelectedCity("Naxçıvan");
      }
    }
  }, [filters.unvan]);

  const set = (key, val) => onUpdate({ [key]: val });

  const handleSearch = () => {
    onSearch();
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      otaqSayi: "",
      minQiymet: "",
      maxQiymet: "",
      unvan: "",
      minKv: "",
      maxKv: "",
      minMertebe: "",
      maxMertebe: "",
      temir: "",
      buildingType: "",
      emlakTipi: "",
    };
    onUpdate(resetFilters);
    onSearch(resetFilters);
    onClose();
  };

  return (
    <div className="nax-app">
      <div className="nax-main">
        <div className={isOpen ? "filter-drawer open" : "filter-drawer"}>
          <button
            type="button"
            className="filter-drawer-backdrop"
            onClick={onClose}
          />
          <div className="filter-drawer-panel">
            <div className="drawer-header">
              <span>Ətraflı Filtr</span>
              <button type="button" onClick={onClose} className="btn-close">
                ✖
              </button>
            </div>

            <div className="drawer-body">
              <div className="filter-panel">

                {/* 📍 ŞƏHƏR SEÇİMİ (2 DÜYMƏ: NAXÇIVAN VƏ BAKI) */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label className="field-label" style={{ fontWeight: "600", marginBottom: "8px", display: "block" }}>
                    📍 Şəhər / Region seçin
                  </label>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                    <button
                      type="button"
                      className={`temir-pill ${selectedCity === "Naxçıvan" ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCity("Naxçıvan");
                        set("unvan", ""); // Şəhər dəyişəndə ünvanı sıfırla
                      }}
                      style={{ flex: 1, padding: "10px", textAlign: "center", fontWeight: "600" }}
                    >
                      📍 Naxçıvan
                    </button>
                    <button
                      type="button"
                      className={`temir-pill ${selectedCity === "Bakı" ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCity("Bakı");
                        set("unvan", ""); // Şəhər dəyişəndə ünvanı sıfırla
                      }}
                      style={{ flex: 1, padding: "10px", textAlign: "center", fontWeight: "600" }}
                    >
                      🏙️ Bakı
                    </button>
                  </div>

                  {/* SEÇİLMİŞ ŞƏHƏRƏ UĞUN ƏRAZİLƏR SİYAHISI */}
                  <label className="field-label" style={{ fontWeight: "600", marginBottom: "6px", display: "block" }}>
                    {selectedCity === "Naxçıvan" ? "Naxçıvan Əraziləri" : "Bakı Əraziləri / Metroları"}
                  </label>

                  {selectedCity === "Naxçıvan" ? (
                    <select
                      className="nax-input nax-select"
                      value={filters.unvan || ""}
                      onChange={(e) => set("unvan", e.target.value)}
                      style={{ cursor: "pointer", fontSize: "14px", padding: "10px 12px" }}
                    >
                      <option value="">Naxçıvan (Bütün ərazilər)</option>
                      {NAXCIVAN_AREAS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="nax-input nax-select"
                      value={filters.unvan || ""}
                      onChange={(e) => set("unvan", e.target.value)}
                      style={{ cursor: "pointer", fontSize: "14px", padding: "10px 12px" }}
                    >
                      <option value="">Bakı (Bütün ərazilər)</option>
                      
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
                </div>

                {/* QİYMƏT / SAHƏ / MƏRTƏBƏ */}
                <div className="filter-grid">
                  <div>
                    <label className="field-label">Qiymət (AZN)</label>
                    <div className="range-group">
                      <input
                        className="nax-input"
                        placeholder="min"
                        type="number"
                        value={filters.minQiymet || ""}
                        onChange={(e) => set("minQiymet", e.target.value)}
                      />
                      <span className="range-sep">—</span>
                      <input
                        className="nax-input"
                        placeholder="max"
                        type="number"
                        value={filters.maxQiymet || ""}
                        onChange={(e) => set("maxQiymet", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Sahə (m²)</label>
                    <div className="range-group">
                      <input
                        className="nax-input"
                        placeholder="min"
                        type="number"
                        value={filters.minKv || ""}
                        onChange={(e) => set("minKv", e.target.value)}
                      />
                      <span className="range-sep">—</span>
                      <input
                        className="nax-input"
                        placeholder="max"
                        type="number"
                        value={filters.maxKv || ""}
                        onChange={(e) => set("maxKv", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Mərtəbə</label>
                    <div className="range-group">
                      <input
                        className="nax-input"
                        placeholder="min"
                        type="number"
                        value={filters.minMertebe || ""}
                        onChange={(e) => set("minMertebe", e.target.value)}
                      />
                      <span className="range-sep">—</span>
                      <input
                        className="nax-input"
                        placeholder="max"
                        type="number"
                        value={filters.maxMertebe || ""}
                        onChange={(e) => set("maxMertebe", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* ƏMLAK NÖVÜ */}
                <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
                  <label className="field-label">Əmlakın növü</label>
                  <div className="temir-pills">
                    <button
                      type="button"
                      className={`temir-pill${filters.emlakTipi === "" ? " active" : ""}`}
                      onClick={() => set("emlakTipi", "")}
                    >
                      Hamısı
                    </button>
                    <button
                      type="button"
                      className={`temir-pill${filters.emlakTipi === "Mənzil" ? " active" : ""}`}
                      onClick={() => set("emlakTipi", "Mənzil")}
                    >
                      Mənzil
                    </button>
                    <button
                      type="button"
                      className={`temir-pill${filters.emlakTipi === "Həyət evi" ? " active" : ""}`}
                      onClick={() => set("emlakTipi", "Həyət evi")}
                    >
                      Həyət evi
                    </button>
                  </div>
                </div>

                {/* OTAQ SAYI */}
                <div style={{ marginBottom: "1rem" }}>
                  <label className="field-label">Otaq sayı</label>
                  <div className="otaq-pills">
                    {OTAQ_OPTIONS.map((o) => (
                      <button
                        key={o.value === "" ? "hamisi" : o.value}
                        type="button"
                        className={`otaq-pill${filters.otaqSayi === o.value ? " active" : ""}`}
                        onClick={() => set("otaqSayi", o.value)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BİNANIN NÖVÜ */}
                <div style={{ marginBottom: "1rem" }}>
                  <label className="field-label">Binanın növü</label>
                  <div className="temir-pills">
                    <button
                      type="button"
                      className={`temir-pill${filters.buildingType === "" ? " active" : ""}`}
                      onClick={() => set("buildingType", "")}
                    >
                      Hamısı
                    </button>
                    <button
                      type="button"
                      className={`temir-pill${filters.buildingType === "YENI" ? " active" : ""}`}
                      onClick={() => set("buildingType", "YENI")}
                    >
                      Yeni tikili
                    </button>
                    <button
                      type="button"
                      className={`temir-pill${filters.buildingType === "KOHNE" ? " active" : ""}`}
                      onClick={() => set("buildingType", "KOHNE")}
                    >
                      Köhnə tikili
                    </button>
                  </div>
                </div>

                {/* TƏMİR */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <label className="field-label">Təmir vəziyyəti</label>
                  <div className="temir-pills">
                    {TEMIR_OPTIONS.map((t) => (
                      <button
                        key={t || "hamisi"}
                        type="button"
                        className={`temir-pill${filters.temir === t ? " active" : ""}`}
                        onClick={() => set("temir", t)}
                      >
                        {t || "Hamısı"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ƏMƏLİYYAT DÜYMƏLƏRİ */}
                <div className="filter-actions">
                  <button type="button" className="btn-reset" onClick={handleReset}>
                    Sıfırla
                  </button>
                  <button type="button" className="btn-search" onClick={handleSearch}>
                    Axtar
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}