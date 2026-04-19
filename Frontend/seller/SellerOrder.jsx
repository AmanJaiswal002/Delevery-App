import React, { useState, useEffect } from "react";
import API from "../api/axios";
import Swal from "sweetalert2";

export default function SellerOrder() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const fetchSellerOrders = async () => {
    try {
      const { data } = await API.get("/orders/seller");
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, { status });
      Swal.fire("Updated", `Order is now ${status}`, "success");
      fetchSellerOrders(); // Refresh table
    } catch (error) {
      Swal.fire("Error", "Failed to update order status", "error");
    }
  };

  return (
    <div className="container">
      <h2>Store Orders</h2>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
               <th style={{ padding: '1rem' }}>Order ID</th>
               <th style={{ padding: '1rem' }}>Amount</th>
               <th style={{ padding: '1rem' }}>Address</th>
               <th style={{ padding: '1rem' }}>Current Status</th>
               <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No incoming orders yet.</td></tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                   <td style={{ padding: '1rem', fontWeight: 'bold' }}>{order._id.substring(0,6)}</td>
                   <td style={{ padding: '1rem', color: '#10b981', fontWeight: '500' }}>₹{order.totalAmount}</td>
                   <td style={{ padding: '1rem' }}>{order.deliveryAddress}</td>
                   <td style={{ padding: '1rem' }}>
                      <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px' }}>{order.orderStatus}</span>
                   </td>
                   <td style={{ padding: '1rem' }}>
                      <select 
                         value={order.orderStatus} 
                         onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                         style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}
                      >
                         <option value="placed">Placed</option>
                         <option value="shipped">Shipped</option>
                         <option value="delivered">Delivered</option>
                      </select>
                   </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
