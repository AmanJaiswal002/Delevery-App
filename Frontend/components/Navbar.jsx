import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, LogOut, User, Home as HomeIcon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <ShoppingBag className="icon" /> DeliveryApp
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <span className="welcome-text">Hi, {user.name} ({user.role})</span>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
              )}
              {user.role === "seller" && (
                <Link to="/seller/dashboard" className="nav-link">Seller Dashboard</Link>
              )}
              {user.role === "customer" && (
                <Link to="/cart" className="nav-link">Cart</Link>
              )}
              <button onClick={logout} className="btn-logout">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
