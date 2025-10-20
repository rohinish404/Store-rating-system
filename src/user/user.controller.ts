import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { StoreService } from '../store/store.service';
import { RatingService } from '../rating/rating.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './user.types';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { SearchStoresDto } from './dto/search-stores.dto';
import { CreateRatingDto } from '../rating/dto/create-rating.dto';
import { UpdateRatingDto } from '../rating/dto/update-rating.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.NormalUser)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly ratingService: RatingService,
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

  @Get('stores')
  @ApiOperation({
    summary: 'Get all stores with ratings',
    description:
      "Returns stores with overall rating and user's submitted rating. Supports search and sorting.",
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of stores',
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'Coffee Shop',
          address: '123 Main St',
          email: 'shop@example.com',
          overallRating: 4.5,
          userSubmittedRating: 5,
        },
      ],
    },
  })
  async getStores(@Request() req, @Query() searchDto: SearchStoresDto) {
    const userId = req.user.sub;
    return await this.storeService.findAllForUser(userId, searchDto);
  }

  @Post('stores/:storeId/rating')
  @ApiOperation({ summary: 'Submit rating for a store' })
  @ApiParam({ name: 'storeId', description: 'Store UUID' })
  @ApiResponse({
    status: 201,
    description: 'Rating submitted successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'You have already rated this store. Use PATCH to update.',
  })
  @ApiResponse({
    status: 404,
    description: 'Store not found',
  })
  async submitRating(
    @Request() req,
    @Param('storeId') storeId: string,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const userId = req.user.sub;

    return await this.ratingService.submitRating(
      userId,
      storeId,
      createRatingDto,
    );
  }

  @Patch('stores/:storeId/rating')
  @ApiOperation({ summary: 'Update existing rating for a store' })
  @ApiParam({ name: 'storeId', description: 'Store UUID' })
  @ApiResponse({
    status: 200,
    description: 'Rating updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Rating not found. Use POST to submit a new rating.',
  })
  async updateRating(
    @Request() req,
    @Param('storeId') storeId: string,
    @Body() updateRatingDto: UpdateRatingDto,
  ) {
    const userId = req.user.sub;

    return await this.ratingService.updateRating(
      userId,
      storeId,
      updateRatingDto,
    );
  }
}
