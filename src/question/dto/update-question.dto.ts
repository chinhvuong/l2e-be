import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
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

export class UpdateQuestionDto {
  @ApiPropertyOptional({
    example: '1+1=?',
  })
  @IsString()
  question: string;

  @ApiPropertyOptional({
    example: ['http://'],
  })
  @IsArray()
  medias: string[];

  @ApiPropertyOptional()
  @IsArray()
  choices: ChoiceDto[];

  @ApiPropertyOptional({
    example: 0,
  })
  @IsNumber()
  correctAnswer: number;
}
