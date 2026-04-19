import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Share2, Send, Camera, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ background: '#111827', color: '#f9fafb', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#4f46e5', marginBottom: '1.5rem' }}>
              <ShoppingBag size={24} /> DeliveryApp
            </div>
            <p style={{ color: '#9ca3af', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Your one-stop destination for fast, reliable, and premium delivery services. Bringing the best products from top vendors right to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '2px solid #4f46e5', width: 'fit-content', paddingBottom: '0.25rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link></li>
              <li><Link to="/cart" style={{ color: '#9ca3af', textDecoration: 'none' }}>Cart</Link></li>
              <li><Link to="/orders" style={{ color: '#9ca3af', textDecoration: 'none' }}>My Orders</Link></li>
              <li><Link to="/register" style={{ color: '#9ca3af', textDecoration: 'none' }}>Join as Seller</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '2px solid #4f46e5', width: 'fit-content', paddingBottom: '0.25rem' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#9ca3af', fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><MapPin size={18} /> 123 Delivery St, Mumbai, India</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Phone size={18} /> +91 9335294886</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Mail size={18} /> support@deliveryapp.com</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '2px solid #4f46e5', width: 'fit-content', paddingBottom: '0.25rem' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#f9fafb', background: '#374151', padding: '8px', borderRadius: '50%', display: 'flex' }}><Share2 size={20} /></a>
              <a href="#" style={{ color: '#f9fafb', background: '#374151', padding: '8px', borderRadius: '50%', display: 'flex' }}><Send size={20} /></a>
              <a href="#" style={{ color: '#f9fafb', background: '#374151', padding: '8px', borderRadius: '50%', display: 'flex' }}><Camera size={20} /></a>
            </div>
            <div style={{ marginTop: '2rem' }}>
               <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#f9fafb' }}>Newsletter</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #374151', background: '#1f2937', color: 'white', fontSize: '0.9rem' }}
                  />
                  <button 
                    onClick={() => {
                        import('sweetalert2').then(Swal => {
                            Swal.default.fire("Success!", "Subscribed successfully!", "success");
                        });
                    }}
                    style={{ padding: '8px 16px', borderRadius: '6px', background: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                  >
                    Subscribe
                  </button>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div style={{ borderTop: '1px solid #374151', paddingTop: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} DeliveryApp. All Rights Reserved. Designed with ❤️ for you.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
