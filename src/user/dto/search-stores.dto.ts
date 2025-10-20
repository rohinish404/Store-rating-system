import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchStoresDto {
  @ApiPropertyOptional({
    description: 'Filter stores by name (partial match)',
    example: 'Coffee',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter stores by address (partial match)',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ['name', 'address', 'rating'],
    example: 'rating',
  })
  @IsOptional()
  @IsEnum(['name', 'address', 'rating'])
  sortBy?: 'name' | 'address' | 'rating';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
