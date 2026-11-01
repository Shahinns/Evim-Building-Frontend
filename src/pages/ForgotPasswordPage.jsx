import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config/api";
import "../styles/Auth.css"; // mövcud auth stillərinizi istifadə edir

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xəta baş verdi");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-success-icon">✉️</div>
          <h2>Email göndərildi</h2>
          <p className="auth-subtitle">
            <strong>{email}</strong> ünvanına şifrə sıfırlama linki göndərildi.
            <br />Zəhmət olmasa emailinizi yoxlayın (spam qovluğuna da baxın).
          </p>
          <p className="auth-hint">Link 30 dəqiqə ərzində etibarlıdır.</p>
          <Link to="/auth" className="auth-btn auth-btn-primary" style={{ display: "block", textAlign: "center", marginTop: "1.5rem" }}>
            Girişə qayıt
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Şifrəni unutdum</h2>
        <p className="auth-subtitle">
          Email ünvanınızı daxil edin, sıfırlama linkini göndərək.
        </p>

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email ünvanınız"
              required
              autoFocus
              autoComplete="off"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
            {loading ? "Göndərilir..." : "Sıfırlama linki göndər"}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/auth">← Girişə qayıt</Link>
        </p>
      </div>
    </div>
  );
}