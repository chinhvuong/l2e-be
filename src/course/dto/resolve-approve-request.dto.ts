import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApproveRequestStatus } from '../enum';

export class ResolveApproveRequestDto {
  @ApiProperty({ description: 'request-approve status' })
  @IsEnum(ApproveRequestStatus)
  status: ApproveRequestStatus;

  @ApiPropertyOptional({})
  @IsOptional()
  @IsArray()
  notes: string[];
}
