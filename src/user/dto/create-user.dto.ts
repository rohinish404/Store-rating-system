import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../user.types';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    minLength: 20,
    maxLength: 60,
    example: 'John Michael Doe Smith',
  })
  @IsNotEmpty()
  @IsString()
  @Length(20, 60, {
    message: 'Name must be between 20 and 60 characters',
  })
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'User address',
    maxLength: 400,
    example: '123 Main Street, Apartment 4B, New York, NY 10001, USA',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 400, {
    message: 'Address must not exceed 400 characters',
  })
  address: string;

  @ApiProperty({
    description: 'User password (8-16 chars, must include uppercase and special character)',
    minLength: 8,
    maxLength: 16,
    example: 'MyP@ssw0rd',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 16, {
    message: 'Password must be between 8 and 16 characters',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message: 'Password must include at least one uppercase letter and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.NormalUser,
  })
  @IsNotEmpty()
  @IsEnum(Role, {
    message: 'Role must be one of: admin, normal_user, store_owner',
  })
  role: Role;
}
