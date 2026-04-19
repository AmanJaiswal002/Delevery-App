import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { ShoppingCart, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [productQuantities, setProductQuantities] = useState({});
  const navigate = useNavigate();

  // Real-time search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500); // 500ms delay to avoid many API calls while typing

    return () => clearTimeout(timer);
  }, [search, category]);

  const fetchProducts = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      
      const { data } = await API.get(`/products?${params.toString()}`);
      console.log("Fetched products:", data);
      setProducts(data);
      
      // Initialize quantities for new products
      const qtys = {};
      data.forEach(p => qtys[p._id] = 1);
      setProductQuantities(prev => ({ ...qtys, ...prev }));
    } catch (error) {
      console.error("Failed to load products", error);
      Swal.fire({ icon: "error", title: "Connection Error", text: "Please check if the backend server is running." });
    } finally {
      setLoading(false);
    }
  };

  const updateQty = (id, delta) => {
    setProductQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddToCart = async (productId) => {
    const qty = productQuantities[productId] || 1;
    try {
      await API.post("/cart/add", { productId, quantity: qty });
      Swal.fire({ icon: "success", title: "Success", text: `${qty} item(s) added to cart`, timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops!", text: "Please login to add items to cart" });
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      <header className="home-hero">
        <h1>Welcome to DeliveryApp</h1>
        <p>Discover the best products from our top sellers!</p>
        
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <form onSubmit={fetchProducts} style={{ display: 'flex', background: 'white', borderRadius: '8px', padding: '4px 12px', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
                <Search size={20} color="#6b7280" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ border: 'none', padding: '10px', flex: 1, outline: 'none', borderRadius: '8px', color: '#1f2937' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Search</button>
            </form>

            <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: '600' }}
            >
                <option value="">All Categories</option>
                <option value="Food">Food</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Grocery">Grocery</option>
            </select>
        </div>
      </header>
      
      {loading ? (
        <div className="loader">Loading products...</div>
      ) : (
        <div className="product-grid">
          {products.length === 0 ? (
            <p>No products available right now.</p>
          ) : (
             products.map((product) => (
              <div key={product._id} className="product-card">
                 <Link to={`/product/${product._id}`} className="product-link">
                     <div className="product-img-wrapper">
                        {product.image ? (
                            <img src={product.image} alt={product.title} />
                        ) : (
                            <div className="img-placeholder">No Image</div>
                        )}
                     </div>
                     <div className="product-info">
                        <h3>{product.title}</h3>
                        <p className="price">₹{product.price}</p>
                     </div>
                 </Link>
                 <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '1rem', background: '#f9fafb', padding: '6px', borderRadius: '8px' }}>
                        <button 
                            onClick={(e) => { e.preventDefault(); updateQty(product._id, -1); }}
                            style={{ width: '28px', height: '28px', border: '1px solid #d1d5db', background: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >-</button>
                        <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{productQuantities[product._id] || 1}</span>
                        <button 
                            onClick={(e) => { e.preventDefault(); updateQty(product._id, 1); }}
                            style={{ width: '28px', height: '28px', border: '1px solid #d1d5db', background: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >+</button>
                    </div>
                    <button onClick={() => handleAddToCart(product._id)} className="btn-add-cart" style={{ width: '100%' }}>
                        <ShoppingCart size={16} /> Add to Cart
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
