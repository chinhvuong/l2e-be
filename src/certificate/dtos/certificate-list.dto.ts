import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CertificateListDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  courseId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query: string;
}
