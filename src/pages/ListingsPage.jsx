import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Listings from "../components/Listings";
import "../styles/HomePage.css";
import "../styles/Listings.css";
import "./ListingsPage.css";
import { API_BASE } from "../config/api";

export default function ListingsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const listType = searchParams.get("type");

  let pageTitle = "Bütün elanlar";
  if (listType === "sale") {
    pageTitle = "Satılıq evlər";
  } else if (listType === "rent") {
    pageTitle = "Kirayə evlər";
  }

  useEffect(() => {
    setLoading(true);
    setError(null);

    const p = new URLSearchParams();
    
    const type = searchParams.get("type");
    if (type === "sale") {
      p.set("satIcare", "SATIS");
    } else if (type === "rent") {
      p.set("satIcare", "KİRAYƏ");
    }

    p.set("_t", Date.now());
    const query = p.toString() ? `/search?${p.toString()}` : "";
    
    fetch(`${API_BASE}/api/buildings${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Server xətası: " + res.status);
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((e) => {
        setError(e.message || "Yükləmə alınmadı");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <div className="page" style={{ background: "#f4f4f2", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        
        <div className="listings-page-head">
          <h2>{pageTitle}</h2>
          <Link to="/">← Ana səhifə</Link>
        </div>

        {loading && (
          <p style={{ textAlign: "center", padding: "2rem", color: "#666" }}>Yüklənir...</p>
        )}
        {error && (
          <p style={{ color: "red", textAlign: "center", padding: "2rem" }}>{error}</p>
        )}
        {!loading && !error && data?.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem", 
            background: "#fff", 
            borderRadius: "8px", 
            border: "1px solid #eee", 
            marginTop: "2rem" 
          }}>
            <h3 style={{ color: "#333", marginBottom: "1rem" }}>Nəticə tapılmadı</h3>
            <p style={{ color: "#666" }}>Bu kateqoriyada hal-hazırda elan yoxdur</p>
          </div>
        )}
        {!loading && !error && data?.length > 0 && <Listings data={data} />}
      </div>
    </div>
  );
}