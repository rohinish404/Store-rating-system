import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { ROUTES } from '../constants/routes';
import { getDashboardLink } from '../utils/navigation';
import Button from './Button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-slate-900 no-underline font-medium px-4 py-2 rounded-md transition-colors ${
      isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 py-4 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center gap-8 flex-wrap">
        <NavLink to={getDashboardLink(user?.role)} className="text-2xl font-bold text-blue-600 no-underline whitespace-nowrap">
          Store Rating System
        </NavLink>

        {user && (
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-slate-600 font-medium px-4 py-2 bg-slate-50 rounded-md">
              {user.name} ({user.role.replace('_', ' ')})
            </span>

            {user.role === Role.ADMIN && (
              <>
                <NavLink to={ROUTES.ADMIN.DASHBOARD} className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to={ROUTES.ADMIN.USERS} className={navLinkClass}>
                  Users
                </NavLink>
                <NavLink to={ROUTES.ADMIN.STORES} className={navLinkClass}>
                  Stores
                </NavLink>
              </>
            )}

            {user.role === Role.STORE_OWNER && (
              <NavLink to={ROUTES.STORE_OWNER.DASHBOARD} className={navLinkClass}>
                Dashboard
              </NavLink>
            )}

            {user.role === Role.NORMAL_USER && (
              <NavLink to={ROUTES.USER.STORES} className={navLinkClass}>
                Stores
              </NavLink>
            )}

            <NavLink to={ROUTES.UPDATE_PASSWORD} className={navLinkClass}>
              Change Password
            </NavLink>

            <Button onClick={handleLogout} variant="secondary">
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
