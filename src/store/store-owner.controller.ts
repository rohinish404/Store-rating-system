import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { RatingService } from '../rating/rating.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/user.types';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Store Owner')
@ApiBearerAuth('JWT-auth')
@Controller('store-owner')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.StoreOwner)
export class StoreOwnerController {
  constructor(
    private readonly storeService: StoreService,
    private readonly ratingService: RatingService,
    private readonly userService: UserService,
  ) {}

  @Patch('password')
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect' })
  async updatePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const userId = req.user.sub;

    return await this.userService.updatePassword(
      userId,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword,
    );
  }

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get store owner dashboard',
    description:
      'Returns store information with average rating and total number of ratings',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns store dashboard data',
    schema: {
      example: {
        storeId: 'uuid',
        storeName: 'Coffee Shop',
        email: 'shop@example.com',
        address: '123 Main St',
        averageRating: 4.5,
        totalRatings: 25,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Store not found for this owner',
  })
  async getDashboard(@Request() req) {
    const userId = req.user.sub;

    const store = await this.storeService.findByOwnerId(userId);

    const averageRating =
      await this.ratingService.getAverageRatingForStore(store.id);

    const ratings = await this.ratingService.getRatingsForStore(store.id);

    return {
      storeId: store.id,
      storeName: store.name,
      email: store.email,
      address: store.address,
      averageRating: averageRating,
      totalRatings: ratings.length,
    };
  }

  @Get('ratings')
  @ApiOperation({
    summary: 'Get list of users who rated the store',
    description:
      'Returns a list of all users who have submitted ratings for the store owner\'s store',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of ratings with user details',
    schema: {
      example: [
        {
          id: 'rating-uuid',
          rating: 5,
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:30:00Z',
          user: {
            id: 'user-uuid',
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Store not found for this owner',
  })
  async getRatings(@Request() req) {
    const userId = req.user.sub;

    const store = await this.storeService.findByOwnerId(userId);

    return await this.ratingService.getRatingsForStore(store.id);
  }
}
