import React, { useState, useRef, useEffect } from "react";
import "../styles/HeroSearch.css";
import LocationBrowse from "./LocationBrowse";

function HeroSearch({ filters, onUpdate, onSearch, onOpenFilters, onLocationSelect }) {
  const { otaqSayi, maxQiymet, satIcare, emlakTipi } = filters;
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationDrop(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field, value, shouldSearch = false) => {
    onUpdate({ [field]: value });
    if (shouldSearch) {
      onSearch({ ...filters, [field]: value });
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") onSearch();
  };

  const chips = [
    { label: "Mənzil", value: "Mənzil", icon: "🏢" },
    { label: "Həyət evi", value: "Həyət evi", icon: "🏡" }
  ];

  return (
    <section className="hero">
      <div className="hero-container hero-container--centered" style={{ position: 'relative' }}>
        
        <div className="hero-search-box">
          <div className="hero-searchbar-wrapper">
            
            <div className="hero-deal-pills" role="group" aria-label="Satış və ya kirayə">
              {[
                { label: "Hamısı", value: "" },
                { label: "Satış", value: "SATIS" },
                { label: "Kirayə", value: "KİRAYƏ" },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  className={`hero-deal-pill ${satIcare === value ? "is-active" : ""}`}
                  onClick={() => handleChange("satIcare", value, true)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="filter-chips-container filter-chips-container--top">
              <div className="chips-type-row" role="group" aria-label="Əmlak tipi — Mənzil və ya həyət evi">
                {chips.map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    className={`filter-chip filter-chip--type ${emlakTipi === chip.value ? "active" : ""}`}
                    onClick={() => handleChange("emlakTipi", emlakTipi === chip.value ? "" : chip.value, true)}
                  >
                    <span className="chip-icon" aria-hidden>{chip.icon}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
              
              <div className="chips-advanced-row" style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="filter-chip advanced-chip premium-filter filter-chip--wide" onClick={onOpenFilters}>
                  <span className="chip-icon">✨</span>
                  Ətraflı filtr
                </button>
                
                <div className="location-dropdown-wrapper desktop-only" ref={locationRef} style={{ width: '100%' }}>
                  <button 
                    type="button" 
                    className="filter-chip filter-chip--wide" 
                    style={{ background: '#f1f5f9' }}
                    onClick={() => setShowLocationDrop(!showLocationDrop)}
                  >
                    📍 Konum seç {showLocationDrop ? "▲" : "▼"}
                  </button>

                  {/* Dropdown in the empty right space */}
                  {showLocationDrop && (
                    <div style={{ position: 'absolute', top: '0', right: '0', zIndex: 9999 }}>
                      <div style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
                        <LocationBrowse onSelect={(val) => {
                          onLocationSelect(val);
                          setShowLocationDrop(false);
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hero-searchbar">
              <div className="search-field">
                <select value={otaqSayi} onChange={(e) => handleChange("otaqSayi", e.target.value, true)}>
                  <option value="">🛏️ Otaq</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div className="search-field divider">
                <input
                  type="number"
                  placeholder="💰 Maks. AZN"
                  value={maxQiymet}
                  onChange={(e) => handleChange("maxQiymet", e.target.value)}
                  onKeyDown={handleKey}
                />
              </div>

              <button className="main-search-btn" onClick={() => onSearch()}>Axtar</button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSearch;