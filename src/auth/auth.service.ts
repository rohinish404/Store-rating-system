import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(registerUserDto: RegisterDto) {
    console.log('registerDto', registerUserDto);

    const saltRounds = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltRounds);
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });
    const payload = { sub: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    };
  }
  async loginUser(loginUserDto: LoginDto) {
    console.log('registerDto', loginUserDto);

    const user = await this.userService.getUserByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    };
  }
}
