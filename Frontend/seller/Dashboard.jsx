import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, PlusCircle, TrendingUp, DollarSign } from "lucide-react";
import API from "../api/axios";

export default function SellerDashboard() {
  const [stats, setStats] = useState({ productCount: 0, orderCount: 0, revenue: 0 });

  useEffect(() => {
    const fetchSellerData = async () => {
        try {
            const prodRes = await API.get("/products");
            const orderRes = await API.get("/orders/seller");
            
            // Note: Since backend handles filtering by user role for these, we just count
            const sellerOrders = orderRes.data;
            const rev = sellerOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);

            setStats({
                productCount: prodRes.data.length,
                orderCount: sellerOrders.length,
                revenue: rev
            });
        } catch (e) {
            console.error("Error loading metrics", e);
        }
    };
    fetchSellerData();
  }, []);

  return (
    <div className="container dashboard">
      <h2>Seller Dashboard</h2>
      
      <div className="dashboard-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
         <div className="card" style={{ borderLeft: '4px solid #4f46e5' }}>
            <Package color="#4f46e5" />
            <h3>{stats.productCount}</h3>
            <p>Active Listings</p>
         </div>
         <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
            <TrendingUp color="#10b981" />
            <h3>{stats.orderCount}</h3>
            <p>Orders Received</p>
         </div>
         <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <DollarSign color="#f59e0b" />
            <h3>₹{stats.revenue.toFixed(2)}</h3>
            <p>Total Revenue (Paid)</p>
         </div>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <Package className="icon-large" />
          <h3>Manage Your Products</h3>
          <p>View, edit, or delete items you are selling.</p>
          <button onClick={() => window.location.href='/seller/manage-products'} className="btn-primary">View Products</button>
        </div>
        <div className="card secondary">
          <PlusCircle className="icon-large" />
          <h3>Add New Product</h3>
          <p>List a new item for customers to buy.</p>
          <button onClick={() => window.location.href='/seller/add-product'} className="btn-secondary">Add Item</button>
        </div>
      </div>
    </div>
  );
}
