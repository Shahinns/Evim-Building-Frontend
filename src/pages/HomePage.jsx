import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import Navbar from "../components/Navbar";
import HeroSearch from "../components/HeroSearch";
import FilterDrawer from "../components/FilterDrawer";
import LocationBrowse from "../components/LocationBrowse";
import Listings from "../components/Listings";
import { API_BASE } from "../config/api";

function HomePage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    satIcare: "",
    unvan: "",
    otaqSayi: "",
    maxQiymet: "",
    minQiymet: "",
    minKv: "",
    maxKv: "",
    minMertebe: "",
    maxMertebe: "",
    temir: "",
    buildingType: "",
    emlakTipi: ""
  });

  // Səhifə açılanda bütün elanları gətir
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/buildings?_t=${Date.now()}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Server xətası");
        }
        return data;
      })
      .then(data => {
        console.log("Fetched data:", data);
        setResults(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message || "Məlumatları yükləmək mümkün olmadı.");
        setLoading(false);
      });
  }, []);

  const handleSearch = (newFilters = filters) => {
    setLoading(true);
    setError(null);
    setIsDrawerOpen(false);
    
    const query = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) query.append(key, val);
    });

    fetch(`${API_BASE}/api/buildings/search?${query}`)
      .then(res => res.json())
      .then(data => {
        setResults(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError("Axtarış zamanı xəta baş verdi.");
        setLoading(false);
      });
  };

  const updateFilters = (updatedFields) => {
    setFilters(prev => ({ ...prev, ...updatedFields }));
  };

  return (
    <div className="page page--home">
      <Navbar />
      <HeroSearch 
        filters={filters} 
        onUpdate={updateFilters} 
        onSearch={handleSearch} 
        onOpenFilters={() => setIsDrawerOpen(true)} 
        onLocationSelect={(unvan) => {
          const next = { ...filters, unvan };
          updateFilters({ unvan });
          handleSearch(next);
          document.getElementById("home-listings")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <FilterDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        filters={filters}
        onUpdate={updateFilters}
        onSearch={handleSearch}
      />

      {loading ? (
        <div className="home-loading">Yüklənir...</div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#A32D2D", fontWeight: "600" }}>
          ❌ {error}
          <br />
          <small style={{ fontWeight: "400", color: "#666" }}>Backend URL: {API_BASE}</small>
        </div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "gray" }}>
          Heç bir elan tapılmadı
        </div>
      ) : (
        <main id="home-listings" className="home-listings">
          <Listings data={results} />
        </main>
      )}
    </div>
  );
}

export default HomePage;