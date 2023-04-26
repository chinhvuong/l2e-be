import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class RatingListDto extends PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  course: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
