import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { useFavorites } from "../context/FavoritesContext";
import Navbar from "../components/Navbar";
import Listings from "../components/Listings";
import PaymentModal from "../components/PaymentModal";
import { API_BASE } from "../config/api";
import "../styles/HomePage.css";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("my");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("emlak_token");
    if (!token) return;

    setLoading(true);
    fetch(`${API_BASE}/api/buildings/my-listings?_t=${Date.now()}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMyListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleMakeVip = async (id) => {
    if (!window.confirm("Bu elanı VIP etmək üçün balansınızdan 10 AZN çıxılacaq. Razısınız?")) return;
    try {
      const token = localStorage.getItem("emlak_token");
      const res = await fetch(`${API_BASE}/api/buildings/${id}/vip`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xəta baş verdi");
      alert(data.message);
      // user obyektində balansı lokal olaraq yeniləyək ki, səhifəni yeniləmədən dərhal görünsün
      if (data.newBalance !== undefined) {
        // Gələcəkdə `login(data)` çağıra bilərik ki, Authcontext tam güncəllənsin, amma qısa yol olaraq:
        const updatedUser = { ...user, balance: data.newBalance };
        localStorage.setItem("emlak_user", JSON.stringify(updatedUser));
        window.location.reload(); // Ən sadə yol səhifəni yeniləməkdir ki, həm listings həm də context yenilənsin.
      }
    } catch (err) {
      alert("Xəta: " + err.message);
    }
  };

  // ── GİRİŞ ETMƏYİB ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ maxWidth: "650px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "60px 40px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "5rem", marginBottom: "20px" }}>🏠</div>
            <h1 style={{ fontSize: "1.8rem", color: "#0f172a", marginBottom: "15px", fontWeight: "800" }}>
              Şəxsi Kabinetiniz
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.05rem", lineHeight: "1.8", marginBottom: "35px" }}>
              Hələ elanınız yoxdur.<br />
              <strong style={{ color: "#d97706" }}>Yeni elan</strong> vasitəsilə elanlarınızı yerləşdirə bilərsiniz —<br />
              elan yerləşdirəndən sonra kabinetiniz <strong>avtomatik yaranır</strong> və burada görə bilərsiniz.
            </p>
            <button
              onClick={() => navigate("/elan/yerlesdir")}
              style={{
                background: "#1A1A1A", color: "#fff", border: "none",
                padding: "16px 40px", borderRadius: "14px", fontWeight: "700",
                fontSize: "1.05rem", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.15)"
              }}
            >
              + Yeni Elan Yerləşdir
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GİRİŞ EDİB ────────────────────────────────────────────────────────────
  return (
    <div className="profile-page-container" style={{ background: "#f1f5f9", minHeight: "100vh" }}>
      <Navbar />

      <div className="profile-wrapper" style={{
        maxWidth: "1300px", margin: "0 auto", padding: "40px 20px",
        display: "grid", gridTemplateColumns: "350px 1fr", gap: "30px"
      }}>

        {/* SOL TƏRƏF: İstifadəçi Kartı */}
        <div className="profile-sidebar" style={{ position: "sticky", top: "100px", height: "fit-content" }}>
          <div style={{ background: "#fff", padding: "40px 30px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", textAlign: "center", border: "1px solid #e2e8f0" }}>
            <div style={{
              width: "100px", height: "100px",
              background: "linear-gradient(135deg, #d97706, #b45309)",
              color: "#fff", borderRadius: "50%", margin: "0 auto 20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.5rem", fontWeight: "700", boxShadow: "0 10px 20px rgba(217,119,6,0.2)"
            }}>
              {user.fullName?.[0]?.toUpperCase() || "👤"}
            </div>

            <h2 style={{ fontSize: "1.5rem", marginBottom: "5px", color: "#0f172a" }}>
              {user.fullName || "İstifadəçi"}
            </h2>
            <p style={{ color: "#64748b", marginBottom: "4px", fontSize: "0.95rem" }}>{user.email}</p>
            {user.phone && (
              <p style={{ color: "#94a3b8", marginBottom: "20px", fontSize: "0.9rem" }}>📞 {user.phone}</p>
            )}

            <div style={{ textAlign: "left", background: "#f8fafc", padding: "15px", borderRadius: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.9rem" }}>
                <span style={{ color: "#94a3b8" }}>Hesab növü:</span>
                <span style={{ color: "#334155", fontWeight: "600" }}>
                  {user.role === "AGENCY" ? "🏢 Agentlik" : "İstifadəçi"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.9rem" }}>
                <span style={{ color: "#94a3b8" }}>Elan limiti:</span>
                <span style={{ color: "#334155", fontWeight: "600" }}>
                  {myListings.length} / {user.listingLimit || 5}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.9rem" }}>
                <span style={{ color: "#94a3b8" }}>💰 Balans:</span>
                <span style={{ color: "#10b981", fontWeight: "700", fontSize: "1.1rem" }}>
                  {user.balance?.toFixed(2) || "0.00"} AZN
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsPaymentOpen(true)}
              style={{ width: "100%", padding: "10px", borderRadius: "12px", border: "1px solid #10b981", background: "#f0fdf4", color: "#10b981", fontWeight: "700", cursor: "pointer", marginBottom: "15px" }}
            >
              💵 Balans Artır
            </button>

            <button
              onClick={() => navigate("/elan/yerlesdir")}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "none", background: "#1A1A1A", color: "#fff", fontWeight: "700", cursor: "pointer", marginBottom: "10px" }}
            >
              + Yeni Elan Yerləşdir
            </button>

            <button
              onClick={() => { logout(); navigate("/"); }}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #fee2e2", background: "#fff", color: "#ef4444", fontWeight: "600", cursor: "pointer" }}
              onMouseOver={(e) => e.target.style.background = "#fef2f2"}
              onMouseOut={(e) => e.target.style.background = "#fff"}
            >
              Hesabdan Çıx
            </button>
          </div>

          <div style={{ marginTop: "20px", background: "#fff", borderRadius: "20px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <button
              onClick={() => setActiveTab("my")}
              style={{ width: "100%", padding: "15px 25px", textAlign: "left", background: activeTab === "my" ? "#f1f5f9" : "#fff", border: "none", borderLeft: activeTab === "my" ? "4px solid #d97706" : "4px solid transparent", cursor: "pointer", fontWeight: activeTab === "my" ? "700" : "500", color: activeTab === "my" ? "#d97706" : "#475569" }}
            >
              🏠 Mənim Elanlarım ({myListings.length})
            </button>
            <button
              onClick={() => setActiveTab("fav")}
              style={{ width: "100%", padding: "15px 25px", textAlign: "left", background: activeTab === "fav" ? "#f1f5f9" : "#fff", border: "none", borderLeft: activeTab === "fav" ? "4px solid #d97706" : "4px solid transparent", cursor: "pointer", fontWeight: activeTab === "fav" ? "700" : "500", color: activeTab === "fav" ? "#d97706" : "#475569" }}
            >
              ❤️ Seçilmişlər ({favorites.length})
            </button>
          </div>
        </div>

        {/* SAĞ TƏRƏF */}
        <div className="profile-content">
          <div style={{ background: "#fff", padding: "30px", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid #e2e8f0", minHeight: "600px" }}>
            <h1 style={{ fontSize: "1.8rem", marginBottom: "30px", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
              {activeTab === "my" ? "📢 Yerləşdirdiyiniz Elanlar" : "⭐ Seçilmiş Elanlarınız"}
            </h1>

            {activeTab === "my" ? (
              loading ? <p>Yüklənir...</p> :
              myListings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🏠</div>
                  <p style={{ color: "#64748b", fontSize: "1.2rem", marginBottom: "25px" }}>
                    Hələ heç bir elan yerləşdirməmisiniz.
                  </p>
                  <button
                    onClick={() => navigate("/elan/yerlesdir")}
                    style={{ background: "#d97706", color: "#fff", border: "none", padding: "14px 35px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 20px rgba(217,119,6,0.2)" }}
                  >
                    İlk Elanını Yerləşdir
                  </button>
                </div>
              ) : <Listings data={myListings} onMakeVip={handleMakeVip} />
            ) : (
              favorites.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>❤️</div>
                  <p style={{ color: "#64748b", fontSize: "1.2rem", marginBottom: "25px" }}>Seçilmiş elanınız yoxdur.</p>
                  <button
                    onClick={() => navigate("/elan")}
                    style={{ background: "#d97706", color: "#fff", border: "none", padding: "14px 35px", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}
                  >
                    Elanlara Bax
                  </button>
                </div>
              ) : <Listings data={favorites} />
            )}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .profile-wrapper {
            grid-template-columns: 1fr !important;
            padding: 20px 15px !important;
          }
          .profile-sidebar {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
      
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        onSuccess={(newBalance) => {
          const updatedUser = { ...user, balance: newBalance };
          localStorage.setItem("emlak_user", JSON.stringify(updatedUser));
          window.location.reload();
        }}
      />
    </div>
  );
}
