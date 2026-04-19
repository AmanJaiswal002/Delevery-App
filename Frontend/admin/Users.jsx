import React, { useState, useEffect } from "react";
import API from "../api/axios";
import Swal from "sweetalert2";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlockToggle = async (id, isBlocked) => {
    try {
      await API.put(`/admin/block-user/${id}`);
      Swal.fire("Updated", `User access updated`, "success");
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", "Could not toggle user access", "error");
    }
  };

  return (
    <div className="container">
      <h2>System Users</h2>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
               <th style={{ padding: '1rem' }}>Name</th>
               <th style={{ padding: '1rem' }}>Email</th>
               <th style={{ padding: '1rem' }}>Role</th>
               <th style={{ padding: '1rem' }}>Status</th>
               <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {(users || []).map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                 <td style={{ padding: '1rem', fontWeight: '500' }}>{user.name}</td>
                 <td style={{ padding: '1rem' }}>{user.email}</td>
                 <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{user.role}</td>
                 <td style={{ padding: '1rem' }}>
                    <span style={{ color: user.isBlocked ? '#ef4444' : '#10b981', background: user.isBlocked ? '#fef2f2' : '#dcfce7', padding: '4px 8px', borderRadius: '6px' }}>
                        {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                 </td>
                 <td style={{ padding: '1rem' }}>
                    <button onClick={() => handleBlockToggle(user._id, user.isBlocked)} className={user.isBlocked ? "btn-primary" : "btn-danger"} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                        {user.isBlocked ? "Unblock" : "Block"}
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
