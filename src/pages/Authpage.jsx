import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import "../styles/Auth.css";
import { API_BASE } from "../config/api";

export default function AuthPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1); // 1 = form, 2 = verify code
  const [verifyCode, setVerifyCode] = useState("");

  // Əgər artıq giriş edibsə, ana səhifəyə göndər
  React.useEffect(() => {
    if (user) {
      const returnUrl = new URLSearchParams(location.search).get("returnUrl") || "/";
      navigate(returnUrl);
    }
  }, [user, navigate, location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/quick-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, phone: form.phone, fullName: form.fullName }),
      });
      const raw = await res.text();
      let data = null;
      try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }
      if (!res.ok) throw new Error(data?.message || "Xəta baş verdi");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: verifyCode }),
      });
      const raw = await res.text();
      let data = null;
      try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }
      if (!res.ok) throw new Error(data?.message || "Kod yanlışdır");
      if (!data?.token) throw new Error("Server token göndərmədi");
      
      localStorage.setItem("emlak_token", data.token);
      login(data);
      
      const returnUrl = new URLSearchParams(location.search).get("returnUrl") || "/profile";
      navigate(returnUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          NaxEv<span>.</span>az
        </div>
        
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#1A1A1A" }}>Şəxsi Kabinetə Giriş</h2>
        <p style={{ textAlign: "center", marginBottom: "2rem", color: "#6B6560", fontSize: "0.95rem" }}>
          Şifrəyə ehtiyac yoxdur. Nömrə və emailinizi yazın, daxil olun.
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="auth-form">
            <div className="field">
              <label>Ad və Soyadınız (İstəyə bağlı)</label>
              <input
                type="text"
                name="fullName"
                placeholder="Məs: Əli Vəliyev"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Əlaqə nömrəsi</label>
              <input
                type="text"
                name="phone"
                placeholder="Məs: 050 123 45 67"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Emailiniz</label>
              <input
                type="email"
                name="email"
                placeholder="Məs: adiniz@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-btn" disabled={loading} style={{ background: "#1A1A1A" }}>
              {loading ? "Gözləyin..." : "Təsdiq Kodu Göndər"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="auth-form">
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#1A1A1A', fontWeight: 'bold' }}>
              {form.email} ünvanına göndərilən 6 rəqəmli kodu daxil edin.
            </p>
            <div className="field">
              <input 
                type="text" 
                placeholder="Kod: 123456" 
                value={verifyCode}
                onChange={(e) => { setVerifyCode(e.target.value); setError(""); }}
                required
                style={{ textAlign: 'center', letterSpacing: '2px', fontSize: '1.2rem', fontWeight: 'bold' }} 
              />
            </div>
            
            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-btn" disabled={loading} style={{ background: "#1A1A1A" }}>
              {loading ? "Yoxlanılır..." : "Təsdiqlə və Daxil Ol"}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              style={{ background: "transparent", color: "#6B6560", border: "none", cursor: "pointer", width: "100%", marginTop: "1rem", fontSize: "0.9rem" }}
            >
              Geri qayıt
            </button>
          </form>
        )}
      </div>
    </div>
  );
}