import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum Sort {
  PRICE_ASC = 'price:1',
  RATING_ASC = 'ratingCount:1',
  STUDENT_ASC = 'students:1',
  PRICE_DESC = 'price:-1',
  RATING_DESC = 'ratingCount:-1',
  STUDENT_DESC = 'students:-1',
}
export class CourseFindAllDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  limit: number;

  @ApiPropertyOptional({
    description: 'start from 0',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  page: number;

  @ApiPropertyOptional({
    description: 'Search by name of category',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return value.toString().trim().toLowerCase();
  })
  query: string;

  @ApiPropertyOptional({
    description: 'approved filter',
  })
  @IsOptional()
  @Transform(({ value }) => {
    const t = {
      true: true,
      false: false,
    };
    if (typeof value === 'string') {
      return [t[value]];
    }
    return value.map((i: string) => t[i]);
  })
  @IsArray()
  approved: boolean[];

  @ApiPropertyOptional({
    description: 'Search by _id of category',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  category: string;

  @ApiPropertyOptional({
    description: 'Search by owner of course',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiPropertyOptional({
    description: 'Search by author of course',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ApiPropertyOptional({
    example: [Sort.PRICE_DESC],
    description: `
      enum Sort {
        PRICE_ASC = 'price:1',
        RATING_ASC = 'ratingCount:1',
        STUDENT_ASC = 'students:1',
        PRICE_DESC = 'price:-1',
        RATING_DESC = 'ratingCount:-1',
        STUDENT_DESC = 'students:-1'
      }
    `,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  @IsArray()
  @IsEnum(Sort, { each: true })
  sort: Sort[];
}
