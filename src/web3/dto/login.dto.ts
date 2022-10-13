import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(42, 42)
  @ApiProperty({
    required: true,
    description: 'Ethereum account address',
  })
  walletAddress: string;

  @IsNotEmpty()
  @IsString()
  @Length(132, 132)
  @ApiProperty({
    required: true,
    description: 'Signature for message',
  })
  signature: string;
}
