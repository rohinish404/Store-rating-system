import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, RolesGuard],
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000000000000s' },
    }),
  ],
  exports: [AuthGuard, RolesGuard],
})
export class AuthModule {}
