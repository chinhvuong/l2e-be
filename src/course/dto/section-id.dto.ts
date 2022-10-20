import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class SectionIdDto {
  @ApiProperty({})
  @IsMongoId()
  id: string;
}
