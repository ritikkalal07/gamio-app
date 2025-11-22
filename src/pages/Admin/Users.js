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

  const confirmDelete = (id) => {
    setDeleteUserId(id);
    setShowConfirm(true);
  };

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
    <main className="main-content">
      <header className="main-header">
        <h1>👤 Manage Users</h1>
      </header>

      {editingUserId && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="modal-close" onClick={cancelEdit}>
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
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
              <div className="modal-footer">
                <button type="button" className="btn modal-close" onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <p style={{ textAlign: "center", opacity: 0.7 }}>No users registered yet.</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.isVerified ? "Yes" : "No"}</td>
                  <td className="action-btns">
                    <button className="action-btn edit" onClick={() => startEdit(user)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete" onClick={() => confirmDelete(user._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showConfirm && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-content" style={{ textAlign: "center" }}>
            <p>Are you sure you want to delete this user?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button className="btn btn-danger" onClick={handleDelete}>
                Yes
              </button>
              <button className="btn btn-primary" onClick={() => setShowConfirm(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Users;
