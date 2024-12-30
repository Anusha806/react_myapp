import React, { useContext } from 'react';
import AdminNavbar from './AdminNavbar';
import UserNavbar from './UserNavbar';
import { AuthContext } from './App';

const Navbar = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  if (!isAuthenticated) return null; // No navbar if not logged in

  return (
    <>
      {userRole === 'admin' ? <AdminNavbar /> : <UserNavbar />}
    </>
  );
};

export default Navbar;
