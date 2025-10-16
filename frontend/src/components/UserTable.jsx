import React, { useEffect, useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../services/userService";
import Swal from "sweetalert2";
import UserModal from "./UserModal";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";

const ADMIN_KEY = process.env.REACT_APP_ADMIN_KEY || "mySecretKey123";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => { loadUsers(); }, []);
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data.status === "success" ? res.data.result : []);
    } catch {
      Swal.fire("❌ Error", "Failed to fetch users!", "error");
    } finally { setLoading(false); }
  };

  const openAdd = () => { setEditUser(null); setShowModal(true); };
  const openEdit = (user) => { setEditUser(user); setShowModal(true); };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    });
    if (!confirm.isConfirmed) return;
    try {
      const res = await deleteUser({ id }, ADMIN_KEY);
      Swal.fire({
        title: res.data.status === "success" ? "✅ Deleted" : "❌ Error",
        text: res.data.message,
        icon: res.data.status === "success" ? "success" : "error",
        backdrop: false
      });
      loadUsers();
    } catch {
      Swal.fire("❌ Error", "Delete failed", "error");
    }
  };

  const handleSave = async (formData, isUpdate) => {
    setShowModal(false);
    try {
      const res = isUpdate ? await updateUser(formData, ADMIN_KEY) : await addUser(formData, ADMIN_KEY);
      Swal.fire({
        title: res.data.status === "success" ? "✅ Success" : "❌ Error",
        text: res.data.message,
        icon: res.data.status === "success" ? "success" : "error",
        backdrop: false
      });
      loadUsers();
    } catch {
      Swal.fire("❌ Error", "Something went wrong!", "error");
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(column); setSortDir("asc"); }
    setCurrentPage(1);
  };

  const getSortedUsers = (list) => {
    if (!sortBy) return [...list];
    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a,b)=>{
      const A = a[sortBy]; const B = b[sortBy];
      if(sortBy==="created_at"){ return (new Date(A)-new Date(B))*dir; }
      if(typeof A==="string") return A.localeCompare(B, undefined, { sensitivity:"base"})*dir;
      return (Number(A)-Number(B))*dir;
    });
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = getSortedUsers(filteredUsers);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage) || 1;

  const renderSortArrow = (col) => sortBy!==col?"⇅":sortDir==="asc"?"▲":"▼";

  return (
  <div className="card p-3 shadow-sm rounded-4">
  {/* Heading */}
  <h2 className=" mb-3 highlight-heading">User Management</h2>

  {/* Search + Add button in one row */}
  <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
    {/* Search bar */}
    <div className="search-container">
      <div className="input-group">
        <span className="input-group-text bg-light border-end-0">
          <FaSearch />
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

    {/* Add button */}
    <button
      className="btn btn-custom-dark d-flex align-items-center flex-shrink-0"
      onClick={openAdd}
    >
      <FaPlus className="me-2" /> Add User
    </button>
  </div>


  {/* Table */}
  <div className="table-responsive">
    <table className="table table-hover table-bordered align-middle mb-0">
      <thead className="table-primary">
        <tr>
          <th>#</th>
          <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>Name {renderSortArrow("name")}</th>
          <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>Email {renderSortArrow("email")}</th>
          <th onClick={() => handleSort("created_at")} style={{ cursor: "pointer" }}>Date {renderSortArrow("created_at")}</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5" className="text-center py-4">
              <div className="spinner-border text-primary"/>
            </td>
          </tr>
        ) : currentUsers.length > 0 ? (
          currentUsers.map((user, idx) => (
            <tr key={user.id}>
              <td>{indexOfFirst + idx + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td className="text-center">
                <button className="btn btn-sm btn-outline-success me-1 action-btn" onClick={() => openEdit(user)}><FaEdit/></button>
                <button className="btn btn-sm btn-outline-danger action-btn" onClick={() => handleDelete(user.id)}><FaTrash/></button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4 text-muted">No users found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Pagination */}
  {sortedUsers.length > usersPerPage && (
    <div className="d-flex justify-content-center align-items-center mt-3 gap-2 flex-wrap">
      <button className="btn btn-outline-primary btn-sm" disabled={currentPage===1} onClick={() => setCurrentPage(p => p-1)}>Previous</button>
      <span className="fw-semibold">Page {currentPage} of {totalPages}</span>
      <button className="btn btn-outline-primary btn-sm" disabled={currentPage===totalPages} onClick={() => setCurrentPage(p => p+1)}>Next</button>
    </div>
  )}
  
  {/* Modal */}
  <UserModal show={showModal} onClose={() => setShowModal(false)} onSave={handleSave} editUser={editUser}/>
</div>

  );
}
