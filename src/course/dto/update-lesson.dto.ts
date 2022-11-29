import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { mediaType } from '../enum';

export class UpdateLessonDto {
  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsUrl()
  media: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(mediaType)
  mediaType: mediaType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId({ each: true })
  quizzes: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  _id: string;
}
