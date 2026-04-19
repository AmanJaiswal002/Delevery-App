import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";

// Customer
import Home from "../customer/Home";
import Cart from "../customer/Cart";
import Checkout from "../customer/Checkout";
import Orders from "../customer/Orders";
import ProductDetails from "../customer/ProductDetails";

// Seller
import SellerDashboard from "../seller/Dashboard";
import SellerOrder from "../seller/SellerOrder";
import AddProduct from "../seller/AddProduct";
import MangeProduct from "../seller/MangeProduct";
import EditProduct from "../seller/EditProduct";

// Admin
import AdminDashboard from "../admin/Dashboard";
import Users from "../admin/Users";
import AdminProducts from "../admin/Products";
import AdminOrder from "../admin/AdminOrder";

// Common
import Login from "../seller/Login";
import Register from "../seller/Register";

import Footer from "../components/Footer";

import "./App.css";

function App() {
  const { loading } = useAuth();

  if (loading) return <div className="loader">Loading Application...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="main-content" style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer / Shared Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["customer", "seller", "admin"]} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* Seller Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["seller"]} />}>
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/orders" element={<SellerOrder />} />
            <Route path="/seller/add-product" element={<AddProduct />} />
            <Route path="/seller/manage-products" element={<MangeProduct />} />
            <Route path="/seller/edit-product/:id" element={<EditProduct />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrder />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
