import React, { useState } from "react";
import { API_BASE, apiFetch } from "../config/api";

const AMOUNTS = [10, 20, 50, 70, 100, 200];
const PACKAGES = [
  { code: "P50", name: "Standart", price: 50, listingLimit: 30 },
  { code: "P70", name: "Plus", price: 70, listingLimit: 70 },
  { code: "P100", name: "Pro", price: 100, listingLimit: 110 },
];

export default function PaymentModal({ isOpen, onClose, onSuccess, user }) {
  const [tab, setTab] = useState("topup");
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });

  if (!isOpen) return null;

  const pay = async (path, body) => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`${API_BASE}${path}`, {
        method: "POST",
        includeJson: true,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Ödəniş alınmadı");
      onSuccess?.(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 9999, backdropFilter: "blur(5px)"
    }}>
      <div style={{
        background: "#fff", width: "100%", maxWidth: "460px", borderRadius: "24px",
        padding: "28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", position: "relative",
        maxHeight: "90vh", overflowY: "auto"
      }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#64748b" }}
        >
          ×
        </button>

        <h2 style={{ margin: "0 0 16px", fontSize: "1.4rem", color: "#0f172a" }}>Ödəniş</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button type="button" onClick={() => setTab("topup")} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", background: tab === "topup" ? "#1A1A1A" : "#f1f5f9", color: tab === "topup" ? "#fff" : "#334155" }}>Balans artır</button>
          <button type="button" onClick={() => setTab("package")} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", background: tab === "package" ? "#1A1A1A" : "#f1f5f9", color: tab === "package" ? "#fff" : "#334155" }}>Agentlik paketi</button>
        </div>

        {tab === "topup" ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ fontSize: "2.8rem", marginBottom: "10px" }}>💳</div>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "8px", color: "#0f172a" }}>
              Onlayn Bank Ödənişi Tezliklə
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.92rem", lineHeight: "1.6", marginBottom: "20px" }}>
              Rəsmi bank inteqrasiyası hazırlanır. Balansınızı artırmaq və ya VIP xidmətlər üçün birbaşa dəstək xidməti ilə əlaqə saxlaya bilərsiniz.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a
                href="https://wa.me/?text=Salam,%20NaxEv.az-da%20balans%20artırmaq%20istəyirəm"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "#25D366",
                  color: "#fff",
                  fontWeight: "bold",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                  textAlign: "center"
                }}
              >
                💬 WhatsApp ilə Əlaqə
              </a>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#475569",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Bağla
              </button>
            </div>
          </div>
        ) : (
          <>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 12 }}>
              Yalnız admin təsdiqli agentlik hesabı paket ala bilər. Balansınız: <strong>{(user?.balance ?? 0).toFixed(2)} AZN</strong>
            </p>
            {PACKAGES.map((p) => (
              <div key={p.code} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div>
                  <strong>{p.name}</strong>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{p.price} AZN → {p.listingLimit} aktiv elan</div>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => pay("/api/payment/buy-package", { code: p.code })}
                  style={{ padding: "8px 12px", border: "none", borderRadius: 8, background: "#1A1A1A", color: "#fff", cursor: "pointer", fontWeight: 700 }}
                >
                  Al
                </button>
              </div>
            ))}
            {error && <p style={{ color: "#dc2626" }}>{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
