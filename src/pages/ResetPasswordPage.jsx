import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import "../styles/Auth.css";

export default function ResetPasswordPage() {
  const [searchParams]        = useSearchParams();
  const navigate              = useNavigate();
  const token                 = searchParams.get("token") || "";

  const [password, setPassword]   = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState("");
  const [show, setShow]           = useState(false);

  useEffect(() => {
    if (!token) setError("Token tapılmadı. Emaildəki linki yenidən açın.");
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Şifrə ən az 6 simvol olmalıdır");
      return;
    }
    if (password !== password2) {
      setError("Şifrələr uyğun gəlmir");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Xəta baş verdi");
      setSuccess(true);
      // 3 saniyə sonra login səhifəsinə yönləndir
      setTimeout(() => navigate("/auth"), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2>Etibarsız link</h2>
          <p className="auth-subtitle">Token tapılmadı. Emaildəki linki yenidən açın.</p>
          <Link to="/forgot-password" className="auth-btn auth-btn-primary"
                style={{ display: "block", textAlign: "center", marginTop: "1.5rem" }}>
            Yenidən sorğu göndər
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-success-icon">✅</div>
          <h2>Şifrə dəyişdirildi!</h2>
          <p className="auth-subtitle">
            Şifrəniz uğurla yeniləndi. 3 saniyə ərzində giriş səhifəsinə yönləndiriləcəksiniz.
          </p>
          <Link to="/auth" className="auth-btn auth-btn-primary"
                style={{ display: "block", textAlign: "center", marginTop: "1.5rem" }}>
            İndi daxil ol
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Yeni şifrə</h2>
        <p className="auth-subtitle">Hesabınız üçün yeni şifrə təyin edin.</p>

        <form onSubmit={submit} className="auth-form">
          <div className="auth-field">
            <label>Yeni şifrə</label>
            <div className="auth-input-wrap">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ən az 6 simvol"
                required
                autoFocus
              />
              <button type="button" className="auth-eye" onClick={() => setShow((v) => !v)}>
                {show ? (
                  // eye-off icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  // eye icon
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label>Şifrəni təkrar daxil edin</label>
            <input
              type={show ? "text" : "password"}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Şifrəni təkrarlayın"
              required
            />
          </div>

          {/* Şifrə gücü göstəricisi */}
          {password.length > 0 && (
            <div className="auth-strength">
              <div className={`auth-strength-bar auth-strength-${getStrength(password)}`} />
              <span className="auth-strength-label">{getStrengthLabel(password)}</span>
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
            {loading ? "Saxlanılır..." : "Şifrəni dəyiş"}
          </button>
        </form>
      </div>
    </div>
  );
}

function getStrength(pw) {
  if (pw.length < 6) return "weak";
  if (pw.length >= 6 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) return "strong";
  return "medium";
}
function getStrengthLabel(pw) {
  const s = getStrength(pw);
  if (s === "weak")   return "Zəif";
  if (s === "medium") return "Orta";
  return "Güclü";
}