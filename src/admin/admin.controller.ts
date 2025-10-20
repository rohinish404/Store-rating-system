import { Body, Controller, Get, Post, UseGuards, Query, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/user/user.types';
import { Roles } from 'src/auth/roles.decorator';
import { CreateStoreAdminDto } from './dto/create-store.admin.dto';
import { CreateUserAdminDto } from './dto/create-admin-user.dto';
import { ListStoresDto } from './dto/list-stores.dto';
import { ListUsersDto } from './dto/list-users.dto';

@ApiTags('Admin')
@ApiBearerAuth('JWT-auth')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Returns total users, stores, and ratings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('dashboard/stats')
  getStats() {
    return this.adminService.getStats();
  }

  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({ status: 201, description: 'Store created successfully' })
  @ApiResponse({ status: 400, description: 'Owner must have StoreOwner role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('stores')
  async createStore(@Body() createStoreDto: CreateStoreAdminDto) {
    return this.adminService.createStore(createStoreDto);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserAdminDto) {
    return this.adminService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Get all stores with filtering and sorting' })
  @ApiResponse({ status: 200, description: 'Returns list of stores with average ratings' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by store name' })
  @ApiQuery({ name: 'email', required: false, description: 'Filter by store email' })
  @ApiQuery({ name: 'address', required: false, description: 'Filter by store address' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'email', 'address', 'createdAt'], description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('stores')
  async listStores(@Query() query: ListStoresDto) {
    return this.adminService.listStores(query);
  }

  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({ status: 200, description: 'Returns user details. If user is StoreOwner, includes their stores with ratings' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('users/:id')
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @ApiOperation({ summary: 'Get all users with filtering and sorting' })
  @ApiResponse({ status: 200, description: 'Returns list of users (password excluded)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by user name' })
  @ApiQuery({ name: 'email', required: false, description: 'Filter by user email' })
  @ApiQuery({ name: 'address', required: false, description: 'Filter by user address' })
  @ApiQuery({ name: 'role', required: false, enum: Role, description: 'Filter by user role' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'email', 'address', 'role', 'createdAt'], description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'], description: 'Sort order' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('users')
  async listUsers(@Query() query: ListUsersDto) {
    return this.adminService.listUsers(query);
  }
}
