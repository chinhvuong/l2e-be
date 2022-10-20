import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class LessonIdDto {
  @ApiProperty({})
  @IsMongoId()
  id: string;
}
