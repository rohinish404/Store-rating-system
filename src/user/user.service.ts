import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(registerUserDto: RegisterDto) {
    try {
      const user = this.userRepository.create({
        name: registerUserDto.name,
        email: registerUserDto.email,
        password: registerUserDto.password,
        address: registerUserDto.address,
      });
      return await this.userRepository.save(user);
    } catch (err: unknown) {
      console.log(err);
      const e = err as { code?: string };
      if (e.code === '23505') {
        throw new ConflictException('Email is already taken');
      }

      throw err;
    }
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }
}
