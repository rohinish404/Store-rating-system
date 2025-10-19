# Assignment Implementation Plan

## Assignment Analysis & Implementation Plan

### Current State
You have:
- ✅ Basic NestJS setup with MongoDB
- ✅ JWT authentication working
- ✅ Role-based guards (AuthGuard, RolesGuard)
- ✅ User module with Admin/Student roles
- ✅ Swagger documentation setup
- ✅ Basic validation pipes

### What Needs to Change

**Major Differences:**
1. **Database**: Assignment requires **PostgreSQL/MySQL** (you're using MongoDB)
2. **Roles**: Need 3 roles (Admin, NormalUser, StoreOwner) vs current 2 (Admin, Student)
3. **New Module**: Need a "Store" module (not "Course")
4. **New Module**: Need a "Rating" module
5. **User Schema**: Need to add `address` field and support store owners
6. **Validations**: Assignment has specific validation rules (name 20-60 chars, password 8-16 chars with uppercase + special char)

---

## Implementation Plan

### Phase 1: Database Migration (MongoDB → PostgreSQL)

**Tasks:**
1. Install PostgreSQL dependencies (`@nestjs/typeorm`, `typeorm`, `pg`)
2. Update `compose.yaml` to use PostgreSQL instead of MongoDB
3. Create TypeORM configuration in `app.module.ts`
4. Remove Mongoose dependencies

**Why first?** Everything else depends on the database structure.

---

### Phase 2: Update User System

**Tasks:**
1. Update Role enum to include: `Admin`, `NormalUser`, `StoreOwner`
2. Convert User from Mongoose schema to TypeORM entity
3. Add required fields:
   - `name` (single field, 20-60 chars)
   - `address` (max 400 chars)
   - Remove `fname`/`lname`, consolidate to `name`
4. Update password validation (8-16 chars, uppercase + special char)
5. Update all DTOs with proper class-validator decorators
6. Add password update endpoint

---

### Phase 3: Create Store Module

**Tasks:**
1. Generate Store module, controller, service
2. Create Store entity (TypeORM):
   - `id`, `name`, `email`, `address`, `ownerId` (foreign key to User)
3. Create Store DTOs:
   - `CreateStoreDto`
   - `UpdateStoreDto`
   - `StoreResponseDto` (with calculated rating)
4. Implement endpoints:
   - `POST /stores` (Admin only)
   - `GET /stores` (with filtering, sorting, search)
   - `GET /stores/:id` (detailed view)
5. Add relationship: Store belongs to User (StoreOwner)

---

### Phase 4: Create Rating Module

**Tasks:**
1. Generate Rating module, controller, service
2. Create Rating entity (TypeORM):
   - `id`, `userId`, `storeId`, `rating` (1-5), `createdAt`, `updatedAt`
   - Composite unique constraint: one rating per user per store
3. Create Rating DTOs:
   - `CreateRatingDto`
   - `UpdateRatingDto`
4. Implement endpoints:
   - `POST /ratings` (NormalUser submits rating)
   - `PUT /ratings/:id` (NormalUser updates their rating)
   - `GET /ratings/store/:storeId` (list ratings for a store)
5. Add calculated fields:
   - Average rating per store
   - User's submitted rating for each store

---

### Phase 5: Admin Dashboard & Endpoints

**Tasks:**
1. Create Admin controller with endpoints:
   - `POST /admin/users` (create users with any role)
   - `POST /admin/stores` (create stores)
   - `GET /admin/dashboard/stats` (total users, stores, ratings)
   - `GET /admin/users` (list with filters, sorting)
   - `GET /admin/stores` (list with filters, sorting)
   - `GET /admin/users/:id` (detailed view with rating if store owner)
2. Implement filtering & sorting query parameters
3. Add pagination support

---

### Phase 6: Normal User Features

**Tasks:**
1. Update auth endpoints:
   - `POST /auth/register` (for NormalUser only, with address)
   - `POST /auth/login` (all roles)
2. Create user profile endpoints:
   - `PUT /users/me/password` (update own password)
   - `GET /users/me` (view own profile)
3. Enhance store listing for normal users:
   - `GET /stores` (with search by name/address)
   - Include overall rating + user's submitted rating
4. Rating endpoints (already in Phase 4)

---

### Phase 7: Store Owner Dashboard

**Tasks:**
1. Create StoreOwner controller:
   - `GET /store-owner/dashboard` (average rating, list of raters)
   - `PUT /store-owner/password` (update password)
2. Implement relationship queries to get:
   - Users who rated the store
   - Average rating calculation

---

### Phase 8: Enhanced Validations & Business Logic

**Tasks:**
1. Update all DTOs with assignment-specific validations:
   - Name: 20-60 chars
   - Address: max 400 chars
   - Password: 8-16 chars, 1 uppercase, 1 special char
   - Email: standard validation
2. Add custom validators if needed
3. Ensure unique email constraint
4. Prevent duplicate ratings (enforce at DB level)

---

### Phase 9: Swagger Documentation

**Tasks:**
1. Add `@ApiTags()` to all controllers
2. Add `@ApiOperation()`, `@ApiResponse()` to all endpoints
3. Add `@ApiBearerAuth()` to protected routes
4. Document query parameters for filtering/sorting
5. Add examples for request/response bodies

---

### Phase 10: Testing & Refinement

**Tasks:**
1. Test all role-based access controls
2. Test validation rules
3. Test rating calculations
4. Test filtering/sorting
5. Test password update functionality
6. Fix any bugs
7. Ensure best practices (error handling, logging, etc.)

---

## Recommended Order of Execution

```
1. Phase 1 (Database Migration) → Critical foundation
2. Phase 2 (User System) → Core entity
3. Phase 3 (Store Module) → Second core entity
4. Phase 4 (Rating Module) → Relationships & core feature
5. Phase 5 (Admin Features) → Admin functionality
6. Phase 6 (Normal User Features) → User functionality
7. Phase 7 (Store Owner Features) → Owner functionality
8. Phase 8 (Validations) → Polish throughout
9. Phase 9 (Swagger Docs) → Documentation
10. Phase 10 (Testing) → Final validation
```

---

## Estimated Effort

- **Phase 1**: 1-2 hours (database migration is tricky)
- **Phases 2-4**: 3-4 hours (core entities)
- **Phases 5-7**: 3-4 hours (role-specific features)
- **Phases 8-10**: 2-3 hours (polish & testing)

**Total: ~10-15 hours of focused work**

---

## Assignment Requirements Summary

### Tech Stack
- Backend: NestJS ✅
- Database: PostgreSQL/MySQL (need to migrate from MongoDB)
- Frontend: ReactJS (separate project)

### User Roles
1. **System Administrator**
   - Add stores, users (normal + admin)
   - View dashboard (total users, stores, ratings)
   - Manage users and stores with filtering
   - View all user details

2. **Normal User**
   - Self-registration
   - View and search stores
   - Submit and modify ratings (1-5)
   - Update password

3. **Store Owner**
   - View dashboard with average rating
   - See list of users who rated their store
   - Update password

### Form Validations
- **Name**: Min 20 characters, Max 60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, must include at least one uppercase letter and one special character
- **Email**: Must follow standard email validation rules

### Additional Requirements
- All tables support sorting (ascending/descending)
- Best practices for frontend and backend
- Proper database schema design
