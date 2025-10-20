# Frontend - Store Management System

React frontend application with role-based dashboards and store management features.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- shadcn/ui components
- Tailwind CSS
- Axios

## Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build
```

## Project Structure

```
src/
├── api/              # API service layer
├── components/       # Reusable components
│   └── ui/          # shadcn/ui components
├── context/         # React context providers
├── layouts/         # Layout components
├── pages/           # Page components
│   ├── admin/       # Admin dashboard pages
│   ├── store-owner/ # Store owner pages
│   └── user/        # User pages
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Features

### Authentication
- Login and registration
- JWT token management
- Protected routes based on user roles

### Admin Dashboard
- User management (CRUD operations)
- Store management
- View user details and activities

### Store Owner Dashboard
- Manage own stores
- Create, update, and delete stores
- View store ratings

### User Features
- Browse and search stores
- Rate stores
- Update password

## API Integration

The frontend connects to the NestJS backend API. Update the base URL in `src/api/axiosInstance.ts` if needed.

Default: `http://localhost:3000`

## Available Routes

- `/login` - Login page
- `/register` - Registration page
- `/admin/*` - Admin dashboard routes
- `/store-owner/*` - Store owner dashboard routes
- `/stores` - User store list
- `/update-password` - Password update page
