import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ChoiceDto {
  @ApiProperty({
    example: '1+1=?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
export class BaseCreateQuestionDto {
  @ApiProperty({
    example: '1+1=?',
  })
  @IsString()
  question: string;

  @ApiProperty({
    example: ['http://'],
  })
  @IsArray()
  medias: string[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(2)
  choices: ChoiceDto[];

  @ApiProperty({
    example: 0,
  })
  @IsNumber()
  correctAnswer: number;
}

export class CreateQuestionDto extends BaseCreateQuestionDto {
  @ApiProperty()
  @IsMongoId()
  courseId: string;
}

export class CreateListQuestionDto {
  @ApiProperty({
    // isArray: true,
    type: BaseCreateQuestionDto,
  })
  @IsArray()
  data: BaseCreateQuestionDto[];

  @ApiProperty()
  @IsMongoId()
  courseId: string;
}
