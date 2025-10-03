import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isVerified: false,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      isVerified: user.isVerified,
    });
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setFormData({ name: "", email: "", password: "", isVerified: false });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${editingUserId}`, formData);
      setUsers(users.map((u) => (u._id === editingUserId ? res.data : u)));
      cancelEdit();
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  // Open confirmation modal
  const confirmDelete = (id) => {
    setDeleteUserId(id);
    setShowConfirm(true);
  };

  // Perform delete after confirmation
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${deleteUserId}`);
      setUsers(users.filter((u) => u._id !== deleteUserId));
      setShowConfirm(false);
      setDeleteUserId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <main className="section container">
      <div className="page__header">
        <h1 className="page__title">Registered Users</h1>
        <p className="page__subtitle">
          View and manage all registered users. Update or delete any user.
        </p>
      </div>

      {/* Edit Form */}
      {editingUserId && (
        <div className="auth__form" style={{ maxWidth: "600px", marginBottom: "2rem" }}>
          <h2>Edit User</h2>
          <form onSubmit={handleUpdate}>
            <div className="form__group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>
            <div className="form__group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>
            <div className="form__group">
              <label>Password</label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>
            <div className="form__group">
              <label>
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                />{" "}
                Verified
              </label>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="btn btn--primary">
                Save
              </button>
              <button type="button" className="btn btn--secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="listing__grid">
        {users.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.7 }}>No users registered yet.</p>
        ) : (
          users.map((user) => (
            <div className="venue__card" key={user._id} style={{ padding: "1rem" }}>
              <div className="venue__card-content">
                <h3 className="venue__title" style={{ marginBottom: "0.5rem" }}>{user.name}</h3>
                <div style={{ fontSize: "0.9rem", color: "#555", marginBottom: "0.5rem" }}>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Password:</strong> {user.password}</div>
                  <div><strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn--secondary" onClick={() => startEdit(user)}>
                    Update
                  </button>
                  <button className="btn btn--danger" onClick={() => confirmDelete(user._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "0.5rem",
            minWidth: "300px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
          }}>
            <p style={{ marginBottom: "1.5rem" }}>Are you sure you want to delete this user?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button className="btn btn--danger" onClick={handleDelete}>Yes</button>
              <button className="btn btn--secondary" onClick={() => setShowConfirm(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Users;

// import React from "react";

// function Admin_Users()
// {
//     return(
// <main className="main-content">
//     <header className="main-header">
//         <h1>Manage Users</h1>
//     </header>

//     <div className="table-container">
//         <table className="data-table">
//             <thead>
//                 <tr>
//                     <th>User ID</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Join Date</th>
//                     <th>Actions</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td>#U001</td>
//                     <td>John Doe</td>
//                     <td>john@example.com</td>
//                     <td>2025-07-20</td>
//                     <td className="action-btns">
//                         <button className="action-btn delete"><i className="fas fa-trash"></i></button>
//                     </td>
//                 </tr>
//                 <tr>
//                     <td>#U002</td>
//                     <td>Jane Smith</td>
//                     <td>jane@example.com</td>
//                     <td>2025-07-22</td>
//                     <td className="action-btns">
//                         <button className="action-btn delete"><i className="fas fa-trash"></i></button>
//                     </td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>
// </main>
//     );
// }
// export default Admin_Users;