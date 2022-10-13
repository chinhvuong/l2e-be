import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(42, 42)
  @ApiProperty({
    required: true,
    description: 'Ethereum account address',
    example: '0x6AB0Cc7184F27b7ABbA97de7d23B26665a4f7d5C',
  })
  walletAddress: string;

  @IsNotEmpty()
  @IsString()
  @Length(132, 132)
  @ApiProperty({
    required: true,
    description: 'Signature for message',
    example:
      '0x3282ea2682c68be7183248f61298b9993962ca41aadec42e0bb1944057ed66750a53aad0b8bf4923671d89a9d40b70e31244e448b35f1dd0c4d88106772275011b',
  })
  signature: string;
}
