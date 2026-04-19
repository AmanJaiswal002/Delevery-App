import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setTitle(data.title || data.name);
        setCategory(data.category);
        setPrice(data.price);
        setStock(data.stock);
        setDescription(data.description);
        setImage(data.image);
      } catch (error) {
        Swal.fire("Error", "Could not fetch product details", "error");
        navigate("/seller/manage-products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${id}`, { title, price, description, image, category, stock });
      Swal.fire("Success", "Product updated successfully", "success");
      navigate("/seller/manage-products");
    } catch (error) {
      Swal.fire("Error", "Could not update product", "error");
    }
  };

  if (loading) return <div className="loader">Loading Product...</div>;

  return (
    <div className="container">
      <h2>Edit Product</h2>
      <div className="auth-box" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" placeholder="Product Title" value={title} onChange={e => setTitle(e.target.value)} required />
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <option value="Food">Food</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Grocery">Grocery</option>
              </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <input type="number" placeholder="Price (₹)" value={price} onChange={e => setPrice(e.target.value)} required />
              <input type="number" placeholder="Stock Quantity" value={stock} onChange={e => setStock(e.target.value)} required />
          </div>
          <input type="url" placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} required style={{ marginTop: '1rem' }} />
          <textarea placeholder="Description" rows="4" value={description} onChange={e => setDescription(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', marginTop: '1rem' }} />
          <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>Update Product</button>
        </form>
      </div>
    </div>
  );
}
