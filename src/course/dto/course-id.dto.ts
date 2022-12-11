import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CourseIdDto {
  @ApiProperty({ description: 'course Id' })
  @IsMongoId()
  id: string;
}
