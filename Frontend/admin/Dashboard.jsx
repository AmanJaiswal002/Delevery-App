import React, { useState, useEffect } from "react";
import { Users, AlertTriangle, TrendingUp, Package } from "lucide-react";
import API from "../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const { data } = await API.get("/admin/analytics");
            setStats(data);
        } catch (e) { console.error(e); }
    };
    fetchStats();
  }, []);

  return (
    <div className="container dashboard admin">
      <h2>Admin Control Panel</h2>
      <div className="dashboard-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card shadow-sm">
           <Users className="text-blue-500" />
           <h3>{stats.totalUsers}</h3>
           <p>Total Users</p>
        </div>
        <div className="card shadow-sm">
           <Package className="text-green-500" />
           <h3>{stats.totalOrders}</h3>
           <p>Orders Placed</p>
        </div>
        <div className="card shadow-sm">
           <TrendingUp className="text-purple-500" />
           <h3>₹{stats.totalRevenue.toFixed(2)}</h3>
           <p>Total Revenue</p>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="card admin">
          <Users className="icon-large" />
          <h3>Manage Users</h3>
          <p>Suspend or elevate permissions for users.</p>
          <button onClick={() => window.location.href='/admin/users'} className="btn-primary">View Users</button>
        </div>
        <div className="card secondary">
          <Package className="icon-large" />
          <h3>Manage Products</h3>
          <p>Global oversight of content.</p>
          <button onClick={() => window.location.href='/admin/products'} className="btn-secondary">View Products</button>
        </div>
      </div>
    </div>
  );
}
