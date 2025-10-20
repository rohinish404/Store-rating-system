import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}
  async submitRating(
    userId: string,
    storeId: string,
    createRatingDto: CreateRatingDto,
  ) {
    try {
      const rating = this.ratingRepository.create({
        userId,
        storeId,
        rating: createRatingDto.rating,
      });
      return await this.ratingRepository.save(rating);
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e.code === '23505') {
        throw new ConflictException(
          'You have already rated this store. Use update instead.',
        );
      }
      if (e.code === '23503') {
        throw new NotFoundException('Store not found');
      }

      throw err;
    }
  }

  async updateRating(
    userId: string,
    storeId: string,
    updateRatingDto: UpdateRatingDto,
  ) {
    const rating = await this.ratingRepository.findOne({
      where: { userId, storeId },
    });

    if (!rating) {
      throw new NotFoundException(
        'Rating not found. Please submit a rating first.',
      );
    }
    rating.rating = updateRatingDto.rating;
    return await this.ratingRepository.save(rating);
  }

  async getUserRatingForStore(
    userId: string,
    storeId: string,
  ): Promise<Rating | null> {
    return await this.ratingRepository.findOne({
      where: { userId, storeId },
    });
  }

  async getAverageRatingForStore(storeId: string): Promise<number> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'average')
      .where('rating.storeId = :storeId', { storeId })
      .getRawOne();

    return result?.average ? parseFloat(result.average) : 0;
  }

  async getRatingsForStore(storeId: string) {
    return await this.ratingRepository.find({
      where: { storeId },
      relations: ['user'],
      select: {
        id: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }
}
