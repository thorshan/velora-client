import React, { createContext, useContext, useState } from "react";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Authentication
  async function login({ email, password }) {
    const res = await authApi.login({ email, password });
    const { user, token } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  }

  // Register
  async function register({ name, email, password }) {
    const res = await authApi.register({ name, email, password });
    const { user, token } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  }

  // Logout
  async function logout() {
    await authApi.logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
