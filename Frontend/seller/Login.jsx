import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = await login(email, password);
      if (role === 'admin') navigate("/admin/dashboard");
      else if (role === 'seller') navigate("/seller/dashboard");
      else navigate("/");
    } catch (error) {
      // Error is handled in context via Swal
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}
