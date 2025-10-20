import { BadRequestException, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from 'src/rating/entities/rating.entity';
import { Store } from 'src/store/entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateStoreAdminDto } from './dto/create-store.admin.dto';
import { Role } from 'src/user/user.types';
import * as bcrypt from 'bcrypt';
import { CreateUserAdminDto } from './dto/create-admin-user.dto';
import { ListStoresDto } from './dto/list-stores.dto';
import { ListUsersDto } from './dto/list-users.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Store) private storeRepository: Repository<Store>,
    @InjectRepository(Rating) private ratingRepository: Repository<Store>,
  ) {}
  async getStats() {
    const totalUsers = await this.userRepository.count();
    const totalStores = await this.storeRepository.count();
    const totalRatings = await this.ratingRepository.count();

    return {
      totalUsers: totalUsers,
      totalStores: totalStores,
      totalRatings: totalRatings,
    };
  }

  async createStore(createStoreDto: CreateStoreAdminDto) {
    const owner = await this.userRepository.findOne({
      where: { id: createStoreDto.ownerId },
    });

    if (!owner || owner.role !== Role.StoreOwner) {
      throw new BadRequestException(
        'Owner must be a user with StoreOwner role',
      );
    }
    const store = this.storeRepository.create(createStoreDto);
    return this.storeRepository.save(store);
  }

  async createUser(createUserDto: CreateUserAdminDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async listStores(query: ListStoresDto) {
    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.ratings', 'rating');

    if (query.name) {
      queryBuilder.andWhere('store.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }
    if (query.email) {
      queryBuilder.andWhere('store.email ILIKE :email', {
        email: `%${query.email}%`,
      });
    }
    if (query.address) {
      queryBuilder.andWhere('store.address ILIKE :address', {
        address: `%${query.address}%`,
      });
    }

    const sortBy = query.sortBy || 'name';
    const sortOrder = query.sortOrder || 'ASC';
    queryBuilder.orderBy(`store.${sortBy}`, sortOrder);

    const stores = await queryBuilder.getMany();

    return stores.map((store) => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating:
        store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.rating, 0) /
            store.ratings.length
          : 0,
      totalRatings: store.ratings.length,
    }));
  }

  async listUsers(query: ListUsersDto) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.address',
        'user.role',
        'user.createdAt',
      ]);

    if (query.name) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: `%${query.name}%`,
      });
    }
    if (query.email) {
      queryBuilder.andWhere('user.email ILIKE :email', {
        email: `%${query.email}%`,
      });
    }
    if (query.address) {
      queryBuilder.andWhere('user.address ILIKE :address', {
        address: `%${query.address}%`,
      });
    }
    if (query.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }

    const sortBy = query.sortBy || 'name';
    const sortOrder = query.sortOrder || 'ASC';
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    return queryBuilder.getMany();
  }

  async getUserDetails(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result: any = { ...user };

    if (user.role === Role.StoreOwner) {
      const stores = await this.storeRepository.find({
        where: { ownerId: id },
        relations: ['ratings'],
      });

      result.stores = stores.map((store) => ({
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating:
          store.ratings.length > 0
            ? store.ratings.reduce((sum, r) => sum + r.rating, 0) /
              store.ratings.length
            : 0,
        totalRatings: store.ratings.length,
      }));
    }

    return result;
  }
}
