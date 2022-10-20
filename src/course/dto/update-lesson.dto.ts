import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsString, IsUrl } from 'class-validator';
import { mediaType } from '../enum';

export class UpdateLessonDto {
  @ApiPropertyOptional({})
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({})
  @IsUrl()
  media: string;

  @ApiPropertyOptional()
  @IsEnum(mediaType)
  mediaType: mediaType;

  @ApiPropertyOptional()
  @IsMongoId({ each: true })
  quizzes: string[];
}
