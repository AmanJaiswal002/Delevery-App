import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import Swal from "sweetalert2";
import ReviewForm from "../components/ReviewForm";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get(`/reviews/${id}`);
      setReviews(data);
    } catch (error) {
       console.error("Error fetching reviews", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not fetch product details", "error");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await API.post("/cart/add", { productId: id, quantity: qty });
      Swal.fire({ icon: "success", title: "Added", text: `${qty} item(s) added to cart`, timer: 1500, showConfirmButton: false });
    } catch (error) {
       Swal.fire({ icon: "error", title: "Oops!", text: "Please login to add to cart" });
    }
  };

  if (loading) return <div className="loader">Loading Product...</div>;
  if (!product) return <div className="container">Product Not Found</div>;

  return (
    <div className="container">
       <div style={{ display: 'flex', gap: '3rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
              <img src={product.image} alt={product.title} style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
          </div>
          <div style={{ flex: '1.5', padding: '1rem' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111827' }}>{product.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b' }}>
                  <Star fill="#f59e0b" /> <span style={{ color: '#6b7280', fontSize: '1.2rem' }}>{product.rating || 'No ratings'}</span>
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5', marginBottom: '1.5rem' }}>₹{product.price}</p>
              <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1.1rem' }}>{product.description}</p>
              
              <div style={{ marginBottom: '2rem' }}>
                  <p style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Select Quantity:</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button 
                        onClick={() => setQty(prev => Math.max(1, prev - 1))}
                        style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >-</button>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>{qty}</span>
                      <button 
                        onClick={() => setQty(prev => Math.min(product.stock, prev + 1))}
                        style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >+</button>
                      <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>({product.stock} in stock)</span>
                  </div>
              </div>

              <p style={{ marginBottom: '1rem', color: product.stock > 0 ? '#10b981' : '#ef4444' }}>
                  {product.stock > 0 ? `Available` : 'Out of Stock'}
              </p>
              
              <button 
                onClick={handleAddToCart} 
                disabled={product.stock === 0} 
                className="btn-primary" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.1rem', opacity: product.stock === 0 ? 0.5 : 1 }}>
                  <ShoppingCart /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
          </div>
       </div>

        <div className="mt-12">
           <h3 className="text-2xl font-bold mb-6" style={{ color: '#f59e0b' }}>Customer Reviews</h3>
           <div className="grid gap-6">
             {reviews.length === 0 ? (
               <p className="text-gray-500">No reviews yet. Be the first to review!</p>
             ) : (
               reviews.map((rev) => (
                 <div key={rev._id} className="p-4 border-b">
                    <div className="flex items-center gap-2 mb-2">
                       <div style={{ display: 'flex', flexDirection: 'row', gap: '2px', color: '#000000' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                             <Star key={i} size={16} fill={i < rev.rating ? '#000000' : 'none'} stroke={i < rev.rating ? '#000000' : 'currentColor'} />
                          ))}
                       </div>
                       <span className="font-bold">{rev.userId?.name || 'User'}</span>
                    </div>
                    <p style={{ color: '#d97706' }}>{rev.comment}</p>
                 </div>
               ))
             )}
           </div>
          
          <div className="max-w-md">
             <ReviewForm productId={id} onReviewAdded={fetchReviews} />
          </div>
       </div>
    </div>
  );
}
