import React, { useState, useEffect } from "react";
import "./style.css";
import Swal from "sweetalert2";

const initialValues = {
  addModal: { name: "", email: "", phone: "" },
  editModal: { _id: "", name: "", email: "", phone: "" }
};

const UserManagement = () => {
  // State Management
  const [show, setShow] = useState({ addModal: false, editModal: false });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(initialValues);

  // Handle Modal Display
  const handleDisplayModal = (modal) => {
    setShow((prev) => ({ ...prev, [modal]: !prev[modal] }));
  };

  // Handle Input Change
  const handleInputChange = (e, modal) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [modal]: { ...prev[modal], [name]: value }
    }));
  };

  // Fetch Users from API
  const gettingUsers = async () => {
    try {
      const response = await fetch("https://user-dummy-api.onrender.com/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      Swal.fire({ title: "Error!", text: error.message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Select User for Editing
  const setSelectedUser = (selectedUserID) => {
    const selectedUser = users.find((user) => user._id === selectedUserID);
    if (selectedUser) {
      setUserDetails((prev) => ({
        ...prev,
        editModal: { ...selectedUser }
      }));
    }
  };

  // Add New User
  const handleAddUser = async () => {
    try {
      const response = await fetch("https://user-dummy-api.onrender.com/users", {
        method: "POST",
        body: JSON.stringify(userDetails.addModal),
        headers: { "Content-Type": "application/json" }
      });

      if (response.status === 201) {
        Swal.fire({ title: "User Added Successfully", icon: "success" });
        handleDisplayModal("addModal");
        setLoading(true);
        gettingUsers();
        setUserDetails(initialValues);
      }
    } catch (error) {
      Swal.fire({ title: "Error!", text: error.message, icon: "error" });
    }
  };

  // Update Existing User
  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `https://user-dummy-api.onrender.com/users/${userDetails.editModal._id}`,
        {
          method: "PUT",
          body: JSON.stringify(userDetails.editModal),
          headers: { "Content-Type": "application/json" }
        }
      );

      if (response.status === 200) {
        Swal.fire({ title: "User Updated Successfully", icon: "success" });
        handleDisplayModal("editModal");
        setLoading(true);
        gettingUsers();
      }
    } catch (error) {
      Swal.fire({ title: "Error!", text: error.message, icon: "error" });
    }
  };

  // Delete User
  const userDelete = async (selectedUserID) => {
    try {
      const response = await fetch(
        `https://user-dummy-api.onrender.com/users/${selectedUserID}`,
        { method: "DELETE" }
      );

      if (response.status === 200) {
        Swal.fire({ title: "User Deleted Successfully", icon: "success" });
        setLoading(true);
        gettingUsers();
      }
    } catch (error) {
      Swal.fire({ title: "Error!", text: error.message, icon: "error" });
    }
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    if (loading) gettingUsers();
  }, [loading]);

  return (
    <section className={`main ${loading ? "loading" : ""}`}>
      <div className="container">
        <h3 className="text-center mt-3">User Management Dashboard</h3>
        <button className="btn btn-success mb-3" onClick={() => handleDisplayModal("addModal")}>
          Add User
        </button>
        
        {/* User Table */}
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => { setSelectedUser(user._id); handleDisplayModal("editModal"); }}>
                    Edit
                  </button>
                  <button className="btn btn-danger" onClick={() => userDelete(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add User Modal */}
        {show.addModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h5>Add User</h5>
              <input type="text" name="name" placeholder="Name" value={userDetails.addModal.name} onChange={(e) => handleInputChange(e, "addModal")} />
              <input type="email" name="email" placeholder="Email" value={userDetails.addModal.email} onChange={(e) => handleInputChange(e, "addModal")} />
              <input type="text" name="phone" placeholder="Phone" value={userDetails.addModal.phone} onChange={(e) => handleInputChange(e, "addModal")} />
              <button onClick={handleAddUser}>Add</button>
              <button onClick={() => handleDisplayModal("addModal")}>Close</button>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {show.editModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h5>Edit User</h5>
              <input type="text" name="name" placeholder="Name" value={userDetails.editModal.name} onChange={(e) => handleInputChange(e, "editModal")} />
              <input type="email" name="email" placeholder="Email" value={userDetails.editModal.email} onChange={(e) => handleInputChange(e, "editModal")} />
              <input type="text" name="phone" placeholder="Phone" value={userDetails.editModal.phone} onChange={(e) => handleInputChange(e, "editModal")} />
              <button onClick={handleUpdateUser}>Save</button>
              <button onClick={() => handleDisplayModal("editModal")}>Close</button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && <div className="backdrop"><div className="spinner-border text-primary"></div></div>}
    </section>
  );
};

export default UserManagement;
