import React from "react";
import Navbar from "../components/Navbar";

export default function AgenciesPage() {
  const agencies = [
    { id: 1, name: "Premium Əmlak Naxçıvan", rating: 4.8, listings: 45, phone: "055-123-45-67", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { id: 2, name: "Naxçıvan Emlak Agentliyi", rating: 4.5, listings: 28, phone: "070-987-65-43", image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { id: 3, name: "RealEstate MMC", rating: 4.2, listings: 15, phone: "050-555-55-55", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { id: 4, name: "Şəhər Mərkəzi Əmlak", rating: 4.9, listings: 112, phone: "077-111-22-33", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  ];

  return (
    <div className="page" style={{ background: "#f4f4f2", minHeight: "100vh" }}>
      <Navbar />
      <header style={{ background: "#fff", padding: "3rem 0", borderBottom: "1px solid #E0D8CC", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.5rem", color: "#1A1A1A", margin: "0 0 0.5rem" }}>Agentliklər</h1>
        <p style={{ color: "#6B6560", fontSize: "1rem", marginBottom: "2rem" }}>Ən etibarlı əmlak agentlikləri ilə əməkdaşlıq edin</p>
        <button 
          onClick={() => alert("Agentlik və ya Makler hesabı açmaq üçün paketlər aylıq 50 AZN-dən başlayır.\nBizimlə əlaqə saxlayın:\n\n📞 Telefon: 050 XXX XX XX\n📧 Email: info@saytinizin.az\n💬 WhatsApp: 050 XXX XX XX\n\nZəng edin və ya yazın — 24 saat ərzində cavab veririk.")}
          style={{ background: "#1A1A1A", color: "#fff", padding: "12px 25px", border: "none", borderRadius: "8px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold" }}>
          🏢 Agentlik və ya Makler hesabı aç
        </button>
      </header>

      <div style={{ maxWidth: "1000px", margin: "3rem auto", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
          {agencies.map(agency => (
            <div key={agency.id} style={{ background: "#fff", borderRadius: "8px", overflow: "hidden", border: "1px solid #E0D8CC", transition: "transform 0.3s", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
              <img src={agency.image} alt={agency.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem", color: "#1A1A1A" }}>{agency.name}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#6B6560", fontSize: "0.9rem" }}>
                  <span>⭐ {agency.rating} Reytinq</span>
                  <span>🏠 {agency.listings} elan</span>
                </div>
                <a href={`tel:${agency.phone}`} style={{ display: "block", textAlign: "center", background: "#C9A84C", color: "#fff", textDecoration: "none", padding: "10px", borderRadius: "4px", fontWeight: "bold" }}>
                  📞 Zəng et
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
