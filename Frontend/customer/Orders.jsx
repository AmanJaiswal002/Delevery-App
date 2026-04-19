import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Package } from "lucide-react";
import socket from "../src/socket";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();

    if (user) {
      // Join personal room to receive tracking updates
      socket.emit("join", user._id);

      // Listen for unified order updates
      const handleUpdate = (data) => {
        console.log("Order update received:", data);
        fetchOrders(); // Refresh list to get latest status
        
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: data.message || "Order Status Updated!",
          showConfirmButton: false,
          timer: 4000
        });
      };

      socket.on("orderUpdate", handleUpdate);

      return () => {
        socket.off("orderUpdate", handleUpdate);
      };
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/user");
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Loading Orders...</div>;

  return (
    <div className="container">
      <h2>My Order History</h2>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <Package size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.5 }} />
          <p>You have not placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1rem' }}>
                 <div>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>Order #{order._id.substring(0, 8).toUpperCase()}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                        background: order.orderStatus === 'delivered' ? '#dcfce7' : order.orderStatus === 'shipped' ? '#fef9c3' : '#e0e7ff', 
                        color: order.orderStatus === 'delivered' ? '#166534' : order.orderStatus === 'shipped' ? '#854d0e' : '#3730a3',
                        padding: '4px 12px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold' 
                    }}>
                        {order.orderStatus.toUpperCase()}
                    </span>
                 </div>
              </div>
              <div>
                 <strong>Total Amount:</strong> ₹{order.totalAmount}
                 <br />
                 <strong style={{ marginTop: '0.5rem', display: 'inline-block' }}>Delivery Address:</strong> {order.deliveryAddress}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
