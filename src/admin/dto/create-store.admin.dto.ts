import { IsEmail, IsString, IsUUID, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreAdminDto {
  @ApiProperty({
    description: 'Store name',
    example: 'Coffee Paradise Downtown Store',
    minLength: 20,
    maxLength: 60,
  })
  @IsString()
  @Length(20, 60)
  name: string;

  @ApiProperty({
    description: 'Store email address',
    example: 'store.downtown@coffeeparadise.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Store address',
    example: '456 Broadway Avenue, Suite 200, Manhattan, New York, NY 10013, USA',
    maxLength: 400,
  })
  @IsString()
  @MaxLength(400)
  address: string;

  @ApiProperty({
    description: 'Owner ID (must be a user with StoreOwner role)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  ownerId: string;
}
