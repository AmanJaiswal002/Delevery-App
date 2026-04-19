import React, { useState, useEffect } from "react";
import API from "../api/axios";
import Swal from "sweetalert2";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleForceDelete = async (id) => {
      try {
          // Confirm deletion before proceeding
          const confirmation = await Swal.fire({
              title: "Are you sure?",
              text: "This removes the product permanently from the platform.",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#ef4444",
              confirmButtonText: "Yes, delete it"
          });

          if(confirmation.isConfirmed) {
            await API.delete(`/admin/product/${id}`);
            Swal.fire("Deleted", "Product purged", "success");
            fetchProducts();
          }
      } catch (error) {
          Swal.fire("Error", "Could not delete product based on server policies", "error");
      }
  }

  return (
    <div className="container">
      <h2>Platform Inventory</h2>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
               <th style={{ padding: '1rem' }}>ID</th>
               <th style={{ padding: '1rem' }}>Title</th>
               <th style={{ padding: '1rem' }}>Category</th>
               <th style={{ padding: '1rem' }}>Price</th>
               <th style={{ padding: '1rem' }}>Admin Action</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                 <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>{p._id.substring(0,6)}</td>
                 <td style={{ padding: '1rem', fontWeight: '500' }}>{p.title || p.name}</td>
                 <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{p.category || 'General'}</td>
                 <td style={{ padding: '1rem' }}>₹{p.price}</td>
                 <td style={{ padding: '1rem' }}>
                    <button onClick={() => handleForceDelete(p._id)} className="btn-danger" style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}>
                        Purge
                    </button>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
