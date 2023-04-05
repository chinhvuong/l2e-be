import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsMongoId,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

export class AnswerQuizDto {
  @ApiProperty()
  @IsMongoId()
  questionId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  answer: number;
}

export class SubmitQuizDto {
  @ApiProperty()
  @IsMongoId()
  gameId: string;

  @ApiProperty({ type: [AnswerQuizDto] })
  @ValidateNested()
  @Type(() => AnswerQuizDto)
  answers: AnswerQuizDto[];
}
