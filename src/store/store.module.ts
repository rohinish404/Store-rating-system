import { Module, forwardRef } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreOwnerController } from './store-owner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { UserModule } from '../user/user.module';
import { RatingModule } from '../rating/rating.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    forwardRef(() => UserModule),
    RatingModule,
  ],
  controllers: [StoreOwnerController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
