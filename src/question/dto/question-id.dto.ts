import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class QuestionIdDto {
  @ApiProperty({})
  @IsMongoId()
  id: string;
}
