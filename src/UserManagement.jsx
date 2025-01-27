import React, { useState, useEffect } from "react";
import './style.css'
import Swal from "sweetalert2";

const initialValues = {
  addModal: { name: "", email: "", phone: "" },
  editModal: { name: "", email: "", phone: "" }
};

const UserManagement = () => {
  // App States
  const [show, setShow] = useState({
    addModal: false,
    editModal: false
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(initialValues);

  // Handling Display Modals
  const handleDisplayModal = (modal) => {
    if (show[modal]) return setShow({ ...show, [modal]: false });
    setShow({ ...show, [modal]: true });
  };

  // Handling Input Changes
  const handleInputChange = (e, modal) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [modal]: {
        ...userDetails[modal],
        [name]: value
      }
    });
  };

  // Handling Getting Users
  const gettingUsers = async () => {
    try {
      const response = await fetch("https://user-dummy-api.onrender.com/users");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Handling Values of Selected User
  const setSelectedUser = (selectedUserID) => {
    setUserDetails({
      ...userDetails,
      editModal: users.find((user) => {
        if (user._id === selectedUserID)
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
          };
      })
    });
  };

  // Handling Adding the new User to the Server
  const handleAddUser = async () => {
    try {
      const response = await fetch(
        "https://user-dummy-api.onrender.com/users",
        {
          method: "POST",
          body: JSON.stringify(userDetails.addModal),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      if (response.status === 201) {
        handleDisplayModal("addModal");
        Swal.fire({
          title: "User Added Successfully",
          icon: "success"
        });
        setLoading(true);
        gettingUsers();
        setUserDetails(initialValues);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handling Updates of Selected User to the Server
  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `https://user-dummy-api.onrender.com/users/${userDetails.editModal._id}`,
        {
          method: "PUT",
          body: JSON.stringify(userDetails.editModal),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        handleDisplayModal("editModal");
        Swal.fire({
          title: "User Updated Successfully",
          icon: "success"
        });
        setLoading(true);
        gettingUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handling Deleting the Selected User from the Server
  const userDelete = async (selectedUserID) => {
    try {
      const response = await fetch(
        `https://user-dummy-api.onrender.com/users/${selectedUserID}`,
        {
          method: "DELETE"
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "User Deleted Successfully",
          icon: "success"
        });
        setLoading(true);
        gettingUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetching Data the from the server
  useEffect(() => {
    gettingUsers();
  }, []);

  return (
    <>
      <section className={`main ${loading ? "loading" : ""}`}>
        <div className="container">
          <div className="row">
            <h3 className="text-center mt-3">User Management Dashboard</h3>
          </div>
          <div className="row mb-4">
            <div className="col-5">
              <button
                type="button"
                className="card"
                onClick={() => {
                  handleDisplayModal("addModal");
                }}
              >
                <div className="card-body py-3">
                  <div className="d-flex align-items-center ">
                    <i className="bi bi-plus-circle"></i>
                    <h5 className="ms-4 pt-2">Add User</h5>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 ">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary px-2 me-2"
                          onClick={() => {
                            setSelectedUser(user._id);
                            handleDisplayModal("editModal");
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-danger px-2"
                          onClick={() => userDelete(user._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* User Add Modal */}
              {show.addModal && (
                <div
                  className={`modal-overlay ${show.addModal ? "show" : "hide"}`}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="userAddLabel">
                          Add User
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => handleDisplayModal("addModal")}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Name"
                              aria-label="name"
                              name="name"
                              value={userDetails.addModal.name}
                              onChange={(e) => handleInputChange(e, "addModal")}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter Email"
                              aria-label="email"
                              name="email"
                              value={userDetails.addModal.email}
                              onChange={(e) => handleInputChange(e, "addModal")}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Phone"
                              aria-label="phone"
                              name="phone"
                              value={userDetails.addModal.phone}
                              onChange={(e) => handleInputChange(e, "addModal")}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary me-4"
                          onClick={() => handleDisplayModal("addModal")}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAddUser}
                        >
                          Add User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Edit Modal */}
              {show.editModal && (
                <div
                  className={`modal-overlay ${
                    show.editModal ? "show" : "hide"
                  }`}
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="userEditLabel">
                          Edit User
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => handleDisplayModal("editModal")}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div>
                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Name"
                              aria-label="name"
                              name="name"
                              value={userDetails.editModal.name}
                              onChange={(e) =>
                                handleInputChange(e, "editModal")
                              }
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter Email"
                              aria-label="email"
                              name="email"
                              value={userDetails.editModal.email}
                              onChange={(e) =>
                                handleInputChange(e, "editModal")
                              }
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter Phone"
                              aria-label="phone"
                              name="phone"
                              value={userDetails.editModal.phone}
                              onChange={(e) =>
                                handleInputChange(e, "editModal")
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary close me-4"
                          aria-label="Close"
                          onClick={() => handleDisplayModal("editModal")}
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleUpdateUser}
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="backdrop">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </section>
    </>
  );
};

export default UserManagement;
