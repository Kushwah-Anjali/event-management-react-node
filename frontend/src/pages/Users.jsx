import React from 'react';
import UserTable from '../components/UserTable';
import '../styles/Users.css';

export default function Users() {
  return (
    <div className="container my-5 pt-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h2 className="fw-bold text-primary mb-2 mb-md-0">User Management</h2>
        <p className="text-muted mb-0">Manage your users efficiently</p>
      </div>
      <UserTable /> 
    </div>
  );
}
