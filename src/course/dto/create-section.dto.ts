import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class ChoiceDto {
  @ApiProperty({
    example: '1+1=?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
export class BaseCreateSectionDto {
  @ApiProperty({})
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class CreateSectionDto extends BaseCreateSectionDto {
  @ApiProperty()
  @IsMongoId()
  courseId: string;
}

export class CreateListSectionDto {
  @ApiProperty({
    // isArray: true,
    type: BaseCreateSectionDto,
  })
  @IsArray()
  data: BaseCreateSectionDto[];

  @ApiProperty()
  @IsMongoId()
  courseId: string;
}
