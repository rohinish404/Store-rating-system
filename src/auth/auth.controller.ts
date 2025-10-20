import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered, returns JWT token and user data',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  async register(@Body() registerUserDto: RegisterDto) {
    const response = await this.authService.registerUser(registerUserDto);
    return response;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in, returns JWT token and user data',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials' })
  async login(@Body() loginUserDto: LoginDto) {
    const response = await this.authService.loginUser(loginUserDto);
    return response;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile information' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
  })
  async getProfile(@Request() req) {
    const userId = req.user.sub;

    const user = await this.userService.getUserById(userId as string);

    console.log(user);
    return {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      address: user?.address,
      role: user?.role,
    };
  }
}
