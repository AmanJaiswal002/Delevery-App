import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Food");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(10);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const { data } = await API.post("/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(data.imageUrl);
      Swal.fire("Uploaded", "Image uploaded successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Image upload failed. Check server.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return Swal.fire("Wait", "Please wait for image to upload", "info");
    try {
      await API.post("/products", { title, price, description, image, category, stock });
      Swal.fire("Success", "Product added successfully", "success");
      navigate("/seller/manage-products");
    } catch (error) {
      Swal.fire("Error", "Could not add product. Ensure all fields are valid.", "error");
    }
  };

  return (
    <div className="container">
      <h2>Add New Product</h2>
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
          <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '0.5rem' }} />
              <input type="url" placeholder="Or paste Image URL" value={image} onChange={e => setImage(e.target.value)} required style={{ width: '100%' }} />
              {image && (
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  <img src={image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px', border: '1px solid #ddd' }} />
                </div>
              )}
              {uploading && <p style={{ fontSize: '0.8rem', color: '#666' }}>Uploading image...</p>}
          </div>
          <textarea placeholder="Description" rows="4" value={description} onChange={e => setDescription(e.target.value)} required style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '6px', marginTop: '1rem' }} />
          <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>Add Product</button>
        </form>
      </div>
    </div>
  );
}
