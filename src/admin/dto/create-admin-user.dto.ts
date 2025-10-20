import {
  IsEmail,
  IsEnum,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/user/user.types';

export class CreateUserAdminDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Michael Doe Smith',
    minLength: 20,
    maxLength: 60,
  })
  @IsString()
  @Length(20, 60)
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (8-16 characters, must include at least one uppercase letter and one special character)',
    example: 'MyP@ssw0rd',
    minLength: 8,
    maxLength: 16,
  })
  @IsString()
  @Length(8, 16)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter and one special character',
  })
  password: string;

  @ApiProperty({
    description: 'User address',
    example: '123 Main Street, Apartment 4B, New York, NY 10001, USA',
    maxLength: 400,
  })
  @IsString()
  @MaxLength(400)
  address: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.NormalUser,
  })
  @IsEnum(Role)
  role: Role;
}
