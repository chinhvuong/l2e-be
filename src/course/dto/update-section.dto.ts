import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdateSectionDto {
  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  _id: string;
}
