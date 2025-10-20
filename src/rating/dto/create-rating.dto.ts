import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: 'Rating value between 1 and 5',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;
}
