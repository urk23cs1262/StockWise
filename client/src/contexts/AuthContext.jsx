// AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // Check token expiry before calling API
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds
      if (decoded.exp < currentTime) {
        logout();
        setLoading(false);
        return;
      }
    } catch (err) {
      // Invalid token format
      logout();
      setLoading(false);
      return;
    }

    // Token is valid, fetch user data
    axiosInstance
      .get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setUser(res.data.data))
      .catch(err => {
        if (err.response && err.response.status === 401) {
          // Token invalid or expired on server
          logout();
        } else {
          console.error("Failed to fetch user:", err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
