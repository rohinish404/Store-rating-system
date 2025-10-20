# Store Management System

A full-stack application for managing stores with role-based access control. Built with NestJS backend and React frontend.

# Demo


https://github.com/user-attachments/assets/00cc706a-453b-4044-845b-15ca2fd0b0e0



## Tech Stack

**Backend:**
- NestJS
- TypeScript
- TypeORM
- SQLite
- JWT Authentication

**Frontend:**
- React
- TypeScript
- Vite
- shadcn/ui
- Axios

## Features

- Role-based authentication (Admin, Store Owner, User)
- Store management and search
- Rating system for stores
- User management dashboard
- Protected routes based on user roles

## Project Structure

- `/src` - NestJS backend application
- `/frontend` - React frontend application (see [frontend/README.md](frontend/README.md) for details)

## Setup

```bash
# Install dependencies
pnpm install

# Run backend in development mode
pnpm run start:dev

# Run frontend (in separate terminal)
cd frontend
pnpm install
pnpm run dev
```

## API Routes

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Admin Routes (requires admin role)
- `GET /admin/users` - List all users
- `GET /admin/users/:id` - Get user details
- `POST /admin/users` - Create new user
- `PATCH /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/stores` - List all stores
- `POST /admin/stores` - Create new store

### Store Owner Routes (requires store owner role)
- `GET /stores/owner` - Get owner's stores
- `POST /stores/owner` - Create new store
- `PATCH /stores/owner/:id` - Update store
- `DELETE /stores/owner/:id` - Delete store

### User Routes
- `GET /stores` - Search stores
- `GET /stores/:id` - Get store details
- `POST /stores/:id/ratings` - Rate a store
- `PATCH /user/password` - Update password



## License

MIT
