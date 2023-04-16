import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ClaimCertificateDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  courseId: number;
}
