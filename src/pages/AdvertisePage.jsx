import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { API_BASE } from "../config/api";

const PLANS = [
  { id: "banner", title: "Ana səhifə banner", price: "150 AZN / ay", desc: "Ana səhifədə böyük banner yeri." },
  { id: "sidebar", title: "Yan panel", price: "80 AZN / ay", desc: "Elan siyahısında yan reklam bloku." },
  { id: "listing", title: "VIP elan paketi", price: "10 AZN / elan", desc: "Elanınız axtarışda yuxarıda görünür." },
];

export default function AdvertisePage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", plan: "banner", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const res = await fetch(`${API_BASE}/api/advertise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xəta");
      setStatus(data.message);
      setForm({ name: "", phone: "", email: "", company: "", plan: "banner", message: "" });
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ background: "#f4f4f2", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 20px 80px" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", marginBottom: 8 }}>Reklam yerləşdirin</h1>
        <p style={{ color: "#64748b", marginBottom: 28 }}>NaxEv.az-da banner, yan panel və VIP elan paketləri.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
          {PLANS.map((p) => (
            <button key={p.id} type="button" onClick={() => setForm({ ...form, plan: p.id })} style={{ textAlign: "left", padding: 18, borderRadius: 16, border: form.plan === p.id ? "2px solid #C9A84C" : "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}>
              <h3 style={{ marginBottom: 6 }}>{p.title}</h3>
              <div style={{ color: "#C9A84C", fontWeight: 700, marginBottom: 8 }}>{p.price}</div>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{p.desc}</p>
            </button>
          ))}
        </div>
        <form onSubmit={submit} style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0", display: "grid", gap: 12 }}>
          <input name="name" required placeholder="Ad Soyad" value={form.name} onChange={onChange} style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
          <input name="company" placeholder="Şirkət" value={form.company} onChange={onChange} style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
          <input name="phone" required placeholder="Telefon" value={form.phone} onChange={onChange} style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
          <input name="email" type="email" required placeholder="Email" value={form.email} onChange={onChange} style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
          <textarea name="message" placeholder="Reklam haqqında qeyd" value={form.message} onChange={onChange} rows={4} style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
          <button type="submit" disabled={loading} style={{ padding: 14, border: "none", borderRadius: 12, background: "#1A1A1A", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Göndərilir..." : "Müraciət göndər"}
          </button>
          {status && <p style={{ margin: 0 }}>{status}</p>}
        </form>
      </div>
    </div>
  );
}
