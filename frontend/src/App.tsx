import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UpdatePassword from './pages/UpdatePassword';
import Unauthorized from './pages/Unauthorized';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminStores from './pages/admin/AdminStores';
import StoreOwnerDashboard from './pages/store-owner/StoreOwnerDashboard';
import StoresList from './pages/user/StoresList';
import AdminLayout from './layouts/AdminLayout';
import StoreOwnerLayout from './layouts/StoreOwnerLayout';
import { Role } from './types';
import { ROUTES } from './constants/routes';
import { getRedirectPathByRole } from './utils/navigation';
import './App.css';

const HomeRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const redirectPath = useMemo(() => {
    return isAuthenticated ? getRedirectPathByRole(user?.role) : ROUTES.LOGIN;
  }, [isAuthenticated, user?.role]);

  return <Navigate to={redirectPath} replace />;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user?.role) {
    const redirectPath = getRedirectPathByRole(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.HOME} element={<HomeRedirect />} />
        <Route path={ROUTES.LOGIN} element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path={ROUTES.REGISTER} element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

        {/* Protected common route */}
        <Route
          path={ROUTES.UPDATE_PASSWORD}
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        {/* Admin routes with nested structure */}
        <Route
          path={ROUTES.ADMIN.ROOT}
          element={
            <ProtectedRoute allowedRoles={[Role.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard/stats" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="stores" element={<AdminStores />} />
        </Route>

        {/* Store owner routes with nested structure */}
        <Route
          path={ROUTES.STORE_OWNER.ROOT}
          element={
            <ProtectedRoute allowedRoles={[Role.STORE_OWNER]}>
              <StoreOwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StoreOwnerDashboard />} />
        </Route>

        {/* Normal user routes */}
        <Route
          path={ROUTES.USER.STORES}
          element={
            <ProtectedRoute allowedRoles={[Role.NORMAL_USER]}>
              <StoresList />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
