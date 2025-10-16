import React from 'react';
import UserTable from '../components/UserTable';
import '../styles/Users.css'; // minimal overrides

export default function Users() {
  return (
    <div className="container my-5">
      <UserTable />
    </div>
  );
}
