import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

export class CertificateListDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  userId: string;
}
