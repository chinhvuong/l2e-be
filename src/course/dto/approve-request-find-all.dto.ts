import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApproveRequestStatus } from '../enum';

export class ApproveFindAllDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  limit: number;

  @ApiPropertyOptional({
    description: 'start from 0',
  })
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  page: number;

  @ApiPropertyOptional({
    description: 'Search by courseId',
  })
  @IsOptional()
  @IsMongoId()
  courseId: string;

  @ApiPropertyOptional({
    description: 'Search by status',
    example: ApproveRequestStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ApproveRequestStatus)
  status: ApproveRequestStatus;
}
