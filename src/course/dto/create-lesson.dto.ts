import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsString, IsUrl } from 'class-validator';
import { mediaType } from '../enum';

export class BaseCreateLessonDto {
  @ApiProperty({})
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({})
  @IsUrl()
  media: string;

  @ApiProperty()
  @IsEnum(mediaType)
  mediaType: mediaType;

  @ApiProperty()
  @IsMongoId({ each: true })
  quizzes: string[];
}

export class CreateLessonDto extends BaseCreateLessonDto {
  @ApiProperty()
  @IsMongoId()
  sectionId: string;
}

export class CreateListLessonDto {
  @ApiProperty({
    // isArray: true,
    type: BaseCreateLessonDto,
  })
  @IsArray()
  data: BaseCreateLessonDto[];

  @ApiProperty()
  @IsMongoId()
  courseId: string;
}
