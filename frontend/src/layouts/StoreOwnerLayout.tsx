import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout wrapper for store owner routes
 * Renders child routes via Outlet component
 */
const StoreOwnerLayout: React.FC = () => {
  return <Outlet />;
};

export default StoreOwnerLayout;
