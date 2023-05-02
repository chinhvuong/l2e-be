import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class RatingListDto extends PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  course: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;
}
