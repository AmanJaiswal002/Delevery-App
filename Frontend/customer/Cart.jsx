import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await API.get("/cart");
      setCart(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete("/cart/remove", { data: { productId } });
      fetchCart();
      Swal.fire({ icon: "success", title: "Removed", text: "Item removed from cart", timer: 1000, showConfirmButton: false });
    } catch (error) {
       Swal.fire({ icon: "error", title: "Error", text: "Could not remove item" });
    }
  };

  if (loading) return <div className="loader">Loading Cart...</div>;

  const totalAmount = cart?.items?.reduce((acc, item) => acc + (item.quantity * item.productId?.price || 0), 0) || 0;

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {(!cart || cart.items.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <p>Your cart is empty. Start shopping!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
           <div style={{ flex: '2', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {cart.items.map((item) => (
                <div key={item.productId?._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1rem' }}>
                   <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img src={item.productId?.image} alt={item.productId?.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div>
                         <h4 style={{ margin: '0 0 0.5rem 0' }}>{item.productId?.title}</h4>
                         <p style={{ margin: 0, fontWeight: 'bold', color: '#4f46e5' }}>₹{item.productId?.price}</p>
                         <p style={{ margin: '0.2rem 0', color: '#6b7280', fontSize: '0.9rem' }}>Qty: {item.quantity}</p>
                      </div>
                   </div>
                   <button onClick={() => removeItem(item.productId?._id)} className="btn-danger" style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
           </div>
           
           <div style={{ flex: '1', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', height: 'fit-content' }}>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                 <span>Subtotal</span>
                 <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                 <span>Delivery</span>
                 <strong>₹5.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                 <strong>Total</strong>
                 <strong style={{ color: '#4f46e5' }}>₹{(totalAmount + 5).toFixed(2)}</strong>
              </div>
              <button onClick={() => window.location.href='/checkout'} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Proceed to Checkout</button>
           </div>
        </div>
      )}
    </div>
  );
}
