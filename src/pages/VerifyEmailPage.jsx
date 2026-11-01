import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { API_BASE } from "../config/api";
import "../styles/Auth.css";

export default function VerifyEmailPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email state-də yoxdursa localStorage-dən götürür
  const email = location.state?.email || localStorage.getItem("pendingEmail") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email tapılmadı. Yenidən qeydiyyatdan keçin.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Kod yanlışdır");
        return;
      }

      localStorage.removeItem("pendingEmail");
      login(data);
      navigate("/");
    } catch (err) {
      setError("Serverlə əlaqə kəsildi");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return alert("Email tapılmadı!");
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      alert(data.message || "Yeni kod göndərildi!");
    } catch (err) {
      alert("Xəta baş verdi");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Təsdiq Kodu</div>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "1.5rem" }}>
          {email ? `${email} ünvanına göndərilən 6 rəqəmli kodu daxil edin.` : "Email tapılmadı"}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Təsdiq kodu</label>
            <input
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
              style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "5px" }}
            />
          </div>

          {error && <p className="auth-error" style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Yoxlanılır..." : "Təsdiqlə"}
          </button>
        </form>

        <p className="auth-switch">
          Kod gəlmədi? <span onClick={handleResend} style={{ cursor: "pointer", color: "blue" }}>Yenidən göndər</span>
        </p>
      </div>
    </div>
  );
}