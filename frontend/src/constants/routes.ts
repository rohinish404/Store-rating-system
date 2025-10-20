/**
 * Application route constants for type-safe navigation
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  UNAUTHORIZED: '/unauthorized',
  UPDATE_PASSWORD: '/update-password',

  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard/stats',
    USERS: '/admin/users',
    STORES: '/admin/stores',
  },

  // Store owner routes
  STORE_OWNER: {
    ROOT: '/store-owner',
    DASHBOARD: '/store-owner/dashboard',
  },

  // Normal user routes
  USER: {
    STORES: '/stores',
  },
} as const;

/**
 * Get all route values as a flat array
 */
export function getAllRoutes(): string[] {
  const routes: string[] = [];

  function extractRoutes(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        routes.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        extractRoutes(obj[key]);
      }
    }
  }

  extractRoutes(ROUTES);
  return routes;
}
