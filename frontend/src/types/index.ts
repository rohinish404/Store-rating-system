// Role enum matching backend: src/user/user.types.ts
export enum Role {
  ADMIN = 'admin',
  NORMAL_USER = 'normalUser',
  STORE_OWNER = 'storeOwner',
}

// User interface matching backend: src/user/entities/user.entity.ts
export interface User {
  id: string; // UUID
  name: string; // max 50 chars in DB
  email: string; // unique, max 255 chars
  address: string; // max 400 chars
  role: Role;
  createdAt?: string;
  updatedAt?: string;
  // password is never returned from backend
}

// Store interface matching backend: src/store/entities/store.entity.ts
export interface Store {
  id: string; // UUID
  name: string; // max 60 chars
  email: string; // unique, max 255 chars
  address: string; // max 400 chars
  ownerId: string; // UUID
  owner?: User; // ManyToOne relation
  averageRating?: number; // Computed field, not in entity
  createdAt?: string;
  updatedAt?: string;
}

// Rating interface matching backend: src/rating/entities/rating.entity.ts
export interface Rating {
  id: string; // UUID
  rating: number; // int (1-5)
  userId: string; // UUID
  storeId: string; // UUID
  user?: User; // ManyToOne relation
  store?: Store; // ManyToOne relation
  createdAt?: string;
  updatedAt?: string;
}

// AuthResponse matching backend: src/auth/dto/auth-response.dto.ts
export interface AuthResponse {
  access_token: string;
  user: User;
}

// DashboardStats for Admin dashboard
export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

// StoreWithUserRating - Custom response from backend for normal users
// Backend returns: overallRating and userSubmittedRating
export interface StoreWithUserRating extends Omit<Store, 'averageRating'> {
  userRating?: number; // Legacy/fallback field
  userSubmittedRating?: number; // Actual field from backend
  overallRating?: number; // Backend returns this for overall store rating
  averageRating?: number; // Fallback field
}

// API Error response structure
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Sort configuration for tables
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// Filter configuration for search/filter forms
export interface FilterConfig {
  name?: string;
  email?: string;
  address?: string;
  role?: Role | '';
}
