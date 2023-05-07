import { PaginationDto } from '@/common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum Sort {
  CREATED_AT_ASC = 'createdAt:1',
  CREATED_AT_DESC = 'createdAt:-1',
  GRADUATION_ASC = 'graduation:1',
  GRADUATION_DESC = 'graduation:-1',
}

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

  @ApiPropertyOptional()
  @IsOptional()
  @ApiPropertyOptional({
    example: [Sort.CREATED_AT_ASC],
    description: `
    enum Sort {
      CREATED_AT_ASC = 'createdAt:1',
      CREATED_AT_DESC = 'createdAt:-1',
      GRADUATION_ASC = 'graduation:1',
      GRADUATION_DESC = 'graduation:-1'
    }
    `,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  @IsArray()
  @IsEnum(Sort, { each: true })
  sort: Sort[];
}
