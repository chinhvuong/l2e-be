import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class ClaimRewardTokenDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.000001)
  amount: number;
}
