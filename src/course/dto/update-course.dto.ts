import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { language } from '../enum';

export class CourseInclude {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resource: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignments: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  certificate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lifetimeAccess: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  device: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  articles: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  exercise: string;
}

export class UpdateCourseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  overview: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: language.EN })
  @IsOptional()
  @IsEnum(language)
  language: language;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  finalTest: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  requirements: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  goals: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  promotionalVideo: string;

  @ApiPropertyOptional()
  @IsOptional()
  include: CourseInclude;
}
