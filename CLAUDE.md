# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS-based Learning Management System (LMS) API with JWT authentication, role-based access control, and MongoDB for data persistence. The system manages users and courses with admin/student roles.

## Development Commands

### Package Manager
This project uses **pnpm** (version 10.18.1). Always use `pnpm` instead of npm or yarn.

### Installation
```bash
pnpm install
```

### Running the Application
```bash
# Development mode with watch
pnpm run start:dev

# Production mode
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

### Testing
```bash
# Run all unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run a single test file
pnpm run test -- path/to/test.spec.ts

# Run e2e tests
pnpm run test:e2e

# Generate coverage report
pnpm run test:cov

# Debug tests
pnpm run test:debug
```

### Code Quality
```bash
# Format code
pnpm run format

# Lint and auto-fix
pnpm run lint

# Build project
pnpm run build
```

### Database
```bash
# Start MongoDB via Docker Compose
docker compose up -d

# Stop MongoDB
docker compose down
```

## Architecture

### Module Structure
The application follows NestJS module architecture with clear separation of concerns:

- **AuthModule**: Handles authentication and authorization
  - JWT-based authentication with 60s token expiration
  - Global JWT module registration
  - Exports authentication services for other modules

- **UserModule**: Manages user data and operations
  - Mongoose schema with email uniqueness constraint
  - Exports UserService for use by AuthModule
  - Role-based user types (Admin, Student)

- **CourseModule**: Manages course CRUD operations
  - Self-contained with its own service and controller
  - Uses Mongoose for data persistence

### Authentication & Authorization

**Two-layer security model:**

1. **AuthGuard** (`src/auth/auth.guard.ts`): JWT token validation
   - Extracts Bearer token from Authorization header
   - Verifies JWT signature and attaches payload to request.user
   - Use as `@UseGuards(AuthGuard)` on protected routes

2. **RolesGuard** (`src/auth/roles.guard.ts`): Role-based access control
   - Works in conjunction with `@Roles()` decorator
   - Checks if authenticated user has required role(s)
   - Always use AFTER AuthGuard: `@UseGuards(AuthGuard, RolesGuard)`

**Example usage:**
```typescript
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Get('admin-only')
adminRoute() { ... }
```

### Data Layer
- **MongoDB** via Mongoose ODM
- Connection URL configured in `.env` as `MONGODB_URL`
- Schemas define data models with decorators (`@Schema()`, `@Prop()`)
- HydratedDocument types for type safety

### Global Configuration
- **ValidationPipe**: Enabled globally in `main.ts` for DTO validation
- **ConfigModule**: Loaded in AppModule for environment variables
- **JWT**: Configured globally in AuthModule

### TypeScript Configuration
- Uses `nodenext` module resolution
- Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- Strict null checks enabled but `noImplicitAny` disabled
- Source root: `src/`, output: `dist/`

## Key Patterns

### Role System
- Roles defined in `src/user/user.types.ts` as enum (Admin, Student)
- Default role is Student
- Roles decorator uses SetMetadata pattern with reflection

### DTO Pattern
- DTOs in `dto/` subdirectories use `class-validator` decorators
- Update DTOs extend from PartialType via `@nestjs/mapped-types`

### Testing
- Unit tests: Co-located with source files as `*.spec.ts`
- E2E tests: In `test/` directory as `*.e2e-spec.ts`
- Jest configured with ts-jest transformer
- Root directory for unit tests: `src/`

## Environment Variables
Required in `.env`:
- `MONGODB_URL`: MongoDB connection string (default: `mongodb://localhost:27017/nest-lms`)
- `PORT`: Application port (default: 3000)

## API Documentation (Swagger)

The API is documented using Swagger/OpenAPI. After starting the application:

**Access Swagger UI:**
```
http://localhost:3000/api
```

**Key Features:**
- Interactive API testing interface
- JWT Bearer token authentication support
- Auto-generated schemas from DTOs
- Request/response examples for all endpoints

**Using Authentication in Swagger:**
1. Register a new user via `POST /auth/register`
2. Copy the JWT token from the response
3. Click the "Authorize" button (lock icon) at the top right
4. Enter the token in the format: `<your-jwt-token>` (no "Bearer" prefix needed)
5. Click "Authorize" to apply the token to all protected endpoints

**Swagger Configuration:**
- Configured in `src/main.ts` with DocumentBuilder
- Uses `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` decorators on controllers
- DTOs decorated with `@ApiProperty()` for automatic schema generation
- Protected routes marked with `@ApiBearerAuth('JWT-auth')`
