import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class QuizFindAll {
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

  @ApiProperty({
    example: '634ac5dc5b8f07aa717aebc2',
  })
  @IsMongoId()
  courseId: string;
}
