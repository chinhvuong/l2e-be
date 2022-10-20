import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsMongoId, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
export class CreateQuizDto {
  @ApiProperty({
    example: ['634ac16cc028d85e3df69c3a', '634ac16cc028d85e3df69c3b'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  questions: string[];

  @ApiProperty({})
  @IsMongoId()
  courseId: string;

  @ApiProperty({})
  @IsString()
  name: string;
}
