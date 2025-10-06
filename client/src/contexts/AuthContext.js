"use client";

import { createContext, useContext, useState, useEffect } from "react";
import http from "@/lib/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await http.get("/auth/me");
      setUser(response.data.user);
      setCompany(response.data.company);
    } catch (error) {
      // Not authenticated
      setUser(null);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    const response = await http.post("/auth/register", data);
    setUser(response.data.user);
    setCompany(response.data.company);
    return response.data;
  };

  const login = async (email, password) => {
    const response = await http.post("/auth/login", { email, password });
    setUser(response.data.user);
    setCompany(response.data.company);
    return response.data;
  };

  const logout = async () => {
    await http.post("/auth/logout");
    setUser(null);
    setCompany(null);
  };

  const value = {
    user,
    company,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "CompanyAdmin",
    isStaffOrAdmin: user?.role === "CompanyAdmin" || user?.role === "Staff",
    register,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
