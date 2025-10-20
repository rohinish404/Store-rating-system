import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Current password for verification',
    example: 'OldPass123!',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password (8-16 chars, must include uppercase and special character)',
    minLength: 8,
    maxLength: 16,
    example: 'NewP@ssw0rd',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 16, {
    message: 'Password must be between 8 and 16 characters',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message: 'Password must include at least one uppercase letter and one special character',
  })
  newPassword: string;
}
