import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/registerUserDto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(registerUserDto: RegisterDto) {
    try {
      const user = this.userRepository.create({
        fname: registerUserDto.fname,
        lname: registerUserDto.lname,
        email: registerUserDto.email,
        password: registerUserDto.password,
      });
      return await this.userRepository.save(user);
    } catch (err: unknown) {
      console.log(err);
      const e = err as { code?: string };
      // PostgreSQL unique violation error code
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
}
