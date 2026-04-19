import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from local storage");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      
      const { token, user: userData, message } = res.data;
      
      setUser(userData);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: message || "You have successfully logged in.",
        timer: 1500,
        showConfirmButton: false,
      });

      return userData.role; // Returning role so components know where to redirect
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed.";
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: msg,
      });
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      const res = await API.post("/auth/register", { name, email, password, role });
      
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Please login with your new credentials.",
      });

      return true;
    } catch (error) {
       const msg = error.response?.data?.message || "Registration failed.";
       Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: msg,
      });
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Optional: Call logout endpoint if your backend needs to invalidate token
    // API.post("/auth/logout").catch(console.error);

    Swal.fire({
      icon: "info",
      title: "Logged Out",
      text: "You have been logged out successfully.",
      timer: 1500,
      showConfirmButton: false,
    });
    
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
