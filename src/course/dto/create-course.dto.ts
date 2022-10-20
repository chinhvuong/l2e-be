import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Become web engineer in one night',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'category id',
    example: '634ac16cc028d85e3df69c3a',
  })
  @IsMongoId()
  category: string;
}
