import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';
import { StoreModule } from 'src/store/store.module';
import { User } from 'src/user/entities/user.entity';
import { Store } from 'src/store/entities/store.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Store, Rating]),
    UserModule,
    StoreModule,
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
