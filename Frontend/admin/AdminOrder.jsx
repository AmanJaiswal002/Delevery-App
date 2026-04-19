import React, { useState, useEffect } from "react";
import API from "../api/axios";

export default function AdminOrder() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchPlatformOrders();
  }, []);

  const fetchPlatformOrders = async () => {
    try {
      // Need an admin specific endpoint according to P.md /api/orders/admin
      const { data } = await API.get("/orders/admin");
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Global Platform Orders</h2>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
               <th style={{ padding: '1rem' }}>Order ID</th>
               <th style={{ padding: '1rem' }}>Total Amount</th>
               <th style={{ padding: '1rem' }}>Status</th>
               <th style={{ padding: '1rem' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
               <tr><td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>No global orders found</td></tr>
            ) : orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                 <td style={{ padding: '1rem', fontWeight: 'bold' }}>{order._id.substring(0,8)}</td>
                  <td style={{ padding: '1rem' }}>₹{order.totalAmount}</td>
                 <td style={{ padding: '1rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>{order.orderStatus}</td>
                 <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
