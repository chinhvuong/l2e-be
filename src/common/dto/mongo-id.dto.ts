import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class MongoIdDto {
  @ApiProperty({ description: 'Mongo Id' })
  @IsMongoId()
  id: string;
}
