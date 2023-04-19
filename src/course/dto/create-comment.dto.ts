import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  replyTo: string;

  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  lesson: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
