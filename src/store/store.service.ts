import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { SearchStoresDto } from 'src/user/dto/search-stores.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async findByOwnerId(ownerId: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { ownerId },
      relations: ['ratings'],
    });

    if (!store) {
      throw new NotFoundException('Store not found for this owner');
    }

    return store;
  }

  async findAllForUser(userId: string, searchDto: SearchStoresDto) {
    const query = this.storeRepository
      .createQueryBuilder('store')
      .leftJoin('store.ratings', 'allRatings')
      .addSelect('AVG(allRatings.rating)', 'averageRating')
      .leftJoin('store.ratings', 'userRating', 'userRating.user_id = :userId', {
        userId,
      })
      .addSelect('userRating.rating', 'userSubmittedRating')
      .groupBy('store.id')
      .addGroupBy('userRating.rating')
      .addGroupBy('userRating.id');

    if (searchDto.name) {
      query.andWhere('store.name ILIKE :name', {
        name: `%${searchDto.name}%`,
      });
    }

    if (searchDto.address) {
      query.andWhere('store.address ILIKE :address', {
        address: `%${searchDto.address}%`,
      });
    }

    if (searchDto.sortBy) {
      switch (searchDto.sortBy) {
        case 'rating':
          query.orderBy('"averageRating"', searchDto.sortOrder || 'ASC', 'NULLS LAST');
          break;
        case 'name':
          query.orderBy('store.name', searchDto.sortOrder || 'ASC');
          break;
        case 'address':
          query.orderBy('store.address', searchDto.sortOrder || 'ASC');
          break;
        default:
          query.orderBy('store.name', 'ASC');
      }
    } else {
      query.orderBy('store.name', 'ASC');
    }

    const rawResults = await query.getRawAndEntities();

    const stores = rawResults.entities.map((store, index) => {
      const raw = rawResults.raw[index];

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        overallRating: raw.averageRating ? parseFloat(raw.averageRating) : 0,
        userSubmittedRating: raw.userSubmittedRating || null,
      };
    });

    return stores;
  }
}
