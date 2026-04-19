import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get("/cart");
        setCart(data);
      } catch (error) {
        console.error("Error fetching cart for checkout", error);
      }
    };
    fetchCart();
  }, []);

  const totalAmount = cart?.items?.reduce((acc, item) => acc + (item.quantity * item.productId?.price || 0), 0) || 0;
  const totalToPay = totalAmount > 0 ? totalAmount + 5 : 0;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address) return Swal.fire("Warning", "Please enter delivery address", "warning");

    try {
      // 1. Create local order first (status: pending)
      const { data: orderData } = await API.post("/orders", { 
        deliveryAddress: address, 
        paymentMethod: "Razorpay" 
      });
      const orderId = orderData._id;

      // 2. Create Razorpay order on backend
      const { data: rpData } = await API.post("/payment/create-order", { amount: totalToPay });
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_51P...", // Replace with real key or env
        amount: rpData.amount,
        currency: rpData.currency,
        name: "DeliveryApp",
        description: "Order Payment",
        order_id: rpData.orderId,
        handler: async (response) => {
          try {
            // 3. Verify payment on backend
            await API.post("/payment/verify", {
               razorpay_order_id: response.razorpay_order_id,
               razorpay_payment_id: response.razorpay_payment_id,
               razorpay_signature: response.razorpay_signature,
               orderId
            });
            Swal.fire({ icon: "success", title: "Success", text: "Order placed & paid!" });
            navigate("/orders");
          } catch (err) {
            Swal.fire({ icon: "error", title: "Payment Error", text: "Verification failed. Contact support." });
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Checkout Failed", text: "Try again later" });
    }
  };

  return (
    <div className="container">
      <h2>Checkout</h2>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '2', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
           <h3>Shipping Information</h3>
           <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <textarea 
                 rows="4" 
                 placeholder="Enter full delivery address" 
                 required 
                 value={address} 
                 onChange={e => setAddress(e.target.value)}
                 style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontFamily: 'inherit', resize: 'none' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}>
                 Pay ₹{totalToPay.toFixed(2)} Now
              </button>
           </form>
        </div>

        <div style={{ flex: '1', background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', height: 'fit-content' }}>
           <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Order Confirmation</h3>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
              <strong>Total to Pay</strong>
              <strong style={{ color: '#4f46e5' }}>₹{totalToPay.toFixed(2)}</strong>
           </div>
           <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>* Includes ₹5.00 delivery fee</p>
        </div>
      </div>
    </div>
  );
}
