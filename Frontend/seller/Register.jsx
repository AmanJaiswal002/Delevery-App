import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await register(name, email, password, role);
       navigate("/login");
    } catch (error) {
      // Handled in context
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create an Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="customer">I want to buy</option>
            <option value="seller">I want to sell</option>
            <option value="admin">Administrator</option>
          </select>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}
