import { Role } from '../types';
import { ROUTES } from '../constants/routes';

/**
 * Normalize role string from backend to frontend enum format
 * Handles both camelCase (normalUser) and SCREAMING_SNAKE_CASE (NORMAL_USER)
 */
function normalizeRole(role: string | Role | null | undefined): Role | null {
  if (!role) return null;

  const roleStr = String(role).toUpperCase();

  // Convert camelCase to SCREAMING_SNAKE_CASE
  // normalUser -> NORMAL_USER, storeOwner -> STORE_OWNER, admin -> ADMIN
  const normalized = roleStr
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toUpperCase();

  if (normalized === 'ADMIN' || normalized === Role.ADMIN) {
    return Role.ADMIN;
  }
  if (normalized === 'NORMAL_USER' || normalized === 'NORMALUSER') {
    return Role.NORMAL_USER;
  }
  if (normalized === 'STORE_OWNER' || normalized === 'STOREOWNER') {
    return Role.STORE_OWNER;
  }

  return null;
}

/**
 * Get the default redirect path for a user based on their role
 */
export function getRedirectPathByRole(role: Role | string | null | undefined): string {
  const normalizedRole = normalizeRole(role as any);

  if (!normalizedRole) {
    return ROUTES.LOGIN;
  }

  switch (normalizedRole) {
    case Role.ADMIN:
      return ROUTES.ADMIN.DASHBOARD;
    case Role.STORE_OWNER:
      return ROUTES.STORE_OWNER.DASHBOARD;
    case Role.NORMAL_USER:
      return ROUTES.USER.STORES;
    default:
      return ROUTES.LOGIN;
  }
}

/**
 * Get the dashboard link for a user based on their role
 * Alias for getRedirectPathByRole for backward compatibility
 */
export function getDashboardLink(role: Role | null | undefined): string {
  return getRedirectPathByRole(role);
}
