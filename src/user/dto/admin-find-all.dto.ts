import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Transform } from 'class-transformer';

enum Sort {
  CREATED_AT_ASC = 'cratedAt:1',
  COURSE_ENROLLED_ASC = 'courseEnrolled:1',
  COURSE_CREATED_ASC = 'courseCreated:1',
  CREATED_AT_DESC = 'cratedAt:-1',
  COURSE_ENROLLED_DESC = 'courseEnrolled:-1',
  COURSE_CREATED_DESC = 'courseCreated:-1',
}

export class AdminFindAllUserDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search by name of or wallet address of user',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    return value.toString().trim().toLowerCase();
  })
  query: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ApiPropertyOptional({
    example: [Sort.CREATED_AT_ASC],
    description: `
        enum Sort {
            CREATED_AT_ASC = 'cratedAt:1',
            
            CREATED_AT_DESC = 'cratedAt:-1',
            
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
