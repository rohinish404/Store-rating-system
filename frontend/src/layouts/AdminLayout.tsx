import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout wrapper for admin routes
 * Renders child routes via Outlet component
 */
const AdminLayout: React.FC = () => {
  return <Outlet />;
};

export default AdminLayout;
