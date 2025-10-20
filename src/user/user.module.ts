import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { StoreModule } from '../store/store.module';
import { RatingModule } from '../rating/rating.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => StoreModule),
    RatingModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
