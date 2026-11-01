import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE, fetchCurrentUser, logoutUser } from "../config/api";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("emlak_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const me = await fetchCurrentUser();
      if (cancelled) return;
      if (me) {
        sessionStorage.setItem("emlak_user", JSON.stringify(me));
        setUser(me);
      } else {
        sessionStorage.removeItem("emlak_user");
        setUser(null);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const login = (userData) => {
    const normalized = {
      email: userData.email || "",
      fullName: userData.fullName || "",
      phone: userData.phone || "",
      id: userData.id || null,
      role: userData.role || "USER",
      balance: userData.balance ?? 0,
      listingLimit: userData.listingLimit ?? 10,
      packageType: userData.packageType || "",
    };
    sessionStorage.setItem("emlak_user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
