import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class QuizIdDto {
  @ApiProperty({})
  @IsMongoId()
  id: string;
}
