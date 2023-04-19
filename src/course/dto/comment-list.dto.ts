import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class CommentListDto extends PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsMongoId()
  lessonId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  replyTo: string;
}
