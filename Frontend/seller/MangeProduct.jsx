import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function MangeProduct() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Assuming GET /products/seller returns the seller's specific products
      const { data } = await API.get("/products"); 
      setProducts(data);
    } catch (error) {
       console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      Swal.fire("Deleted", "Product removed.", "success");
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      Swal.fire("Error", "Could not remove product", "error");
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
         <h2>Manage Your Products</h2>
         <Link to="/seller/add-product" className="btn-primary">Add Product</Link>
      </div>
      <div className="product-table-wrapper" style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '2px solid #f3f4f6', textAlign: 'left'}}>
               <th style={{padding: '1rem'}}>Image</th>
               <th style={{padding: '1rem'}}>Name</th>
               <th style={{padding: '1rem'}}>Price</th>
               <th style={{padding: '1rem'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={{borderBottom: '1px solid #f3f4f6'}}>
                 <td style={{padding: '1rem'}}>
                    {product.image ? <img src={product.image} alt={product.name} width="50" style={{borderRadius: '4px'}} /> : 'No image'}
                 </td>
                 <td style={{padding: '1rem'}}>{product.title || product.name}</td>
                 <td style={{padding: '1rem', fontWeight: 'bold'}}>₹{product.price}</td>
                 <td style={{padding: '1rem', display: 'flex', gap: '0.5rem'}}>
                    <button onClick={() => navigate(`/seller/edit-product/${product._id}`)} className="btn-secondary" style={{padding: '8px', border: '1px solid #e5e7eb', background: 'transparent', cursor: 'pointer', borderRadius: '4px'}}>
                        <Edit size={16} color="#4f46e5" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="btn-danger" style={{padding: '8px', border: '1px solid #e5e7eb', background: 'transparent', cursor: 'pointer', borderRadius: '4px'}}>
                        <Trash2 size={16} color="#ef4444" />
                    </button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>No products found. Start by adding one!</p>}
      </div>
    </div>
  );
}
