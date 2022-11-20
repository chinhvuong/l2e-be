import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class RequestApproveDto {
  @ApiProperty({})
  @IsMongoId()
  id: string;

  @ApiProperty({})
  @IsArray()
  notes: string[];
}
