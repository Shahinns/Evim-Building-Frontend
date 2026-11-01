import React, { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { API_BASE, apiFetch } from "../config/api";
import "../styles/HeroSearch.css";

function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`${API_BASE}/api/admin/users/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Axtarışda xəta");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, field, value) => {
    try {
      const res = await apiFetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "PUT",
        includeJson: true,
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Yenilənmə zamanı xəta");
      }
      const updatedUser = await res.json();
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      alert("Məlumat yeniləndi!");
    } catch (err) {
      alert("Xəta: " + err.message);
    }
  };

  if (authLoading || !user || user.role !== "ADMIN") return null;

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", minHeight: "80vh" }}>
      <h1 style={{ marginBottom: "20px" }}>⚙️ Admin Panel</h1>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        <input 
          type="text" 
          placeholder="Email və ya nömrə ilə axtar..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "10px", flex: 1, borderRadius: "8px", border: "1px solid #ccc" }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading} style={{ padding: "10px 20px", background: "#1e293b", color: "#fff", borderRadius: "8px", border: "none", cursor: "pointer" }}>
          {loading ? "Axtarılır..." : "Axtar"}
        </button>
      </div>

      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {users.map(u => (
          <div key={u.id} style={{ border: "1px solid #e2e8f0", padding: "20px", borderRadius: "12px", background: "#f8fafc" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{u.fullName || "Adsız"}</h3>
            <p style={{ margin: "0 0 5px 0" }}>📧 <strong>Email:</strong> {u.email}</p>
            <p style={{ margin: "0 0 15px 0" }}>📞 <strong>Telefon:</strong> {u.phone || "Yoxdur"}</p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>Balans (AZN)</label>
                <div style={{ display: "flex", gap: "5px" }}>
                  <input type="number" defaultValue={u.balance} id={`balance-${u.id}`} style={{ padding: "8px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }} />
                  <button onClick={() => handleUpdate(u.id, "balance", document.getElementById(`balance-${u.id}`).value)} style={{ padding: "8px 15px", background: "#10b981", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Yadda saxla</button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>Rol</label>
                <div style={{ display: "flex", gap: "5px" }}>
                  <select defaultValue={u.role} id={`role-${u.id}`} style={{ padding: "8px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }}>
                    <option value="USER">USER</option>
                    <option value="AGENCY">AGENCY</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button onClick={() => handleUpdate(u.id, "role", document.getElementById(`role-${u.id}`).value)} style={{ padding: "8px 15px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Yadda saxla</button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>Elan Limiti</label>
                <div style={{ display: "flex", gap: "5px" }}>
                  <input type="number" defaultValue={u.listingLimit} id={`limit-${u.id}`} style={{ padding: "8px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }} />
                  <button onClick={() => handleUpdate(u.id, "listingLimit", document.getElementById(`limit-${u.id}`).value)} style={{ padding: "8px 15px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Yadda saxla</button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>Agentlik Adı (Şirkət)</label>
                <div style={{ display: "flex", gap: "5px" }}>
                  <input type="text" defaultValue={u.companyName || ""} id={`company-${u.id}`} placeholder="Makler MMC" style={{ padding: "8px", width: "100%", borderRadius: "5px", border: "1px solid #ccc" }} />
                  <button onClick={() => handleUpdate(u.id, "companyName", document.getElementById(`company-${u.id}`).value)} style={{ padding: "8px 15px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Yadda saxla</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && !loading && <p>İstifadəçi tapılmadı. Axtarış edin.</p>}
      </div>
    </div>
  );
}

export default AdminPage;
