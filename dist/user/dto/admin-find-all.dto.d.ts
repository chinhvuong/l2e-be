import { PaginationDto } from '@/common/dto/pagination.dto';
declare enum Sort {
    CREATED_AT_ASC = "cratedAt:1",
    COURSE_ENROLLED_ASC = "courseEnrolled:1",
    COURSE_CREATED_ASC = "courseCreated:1",
    CREATED_AT_DESC = "cratedAt:-1",
    COURSE_ENROLLED_DESC = "courseEnrolled:-1",
    COURSE_CREATED_DESC = "courseCreated:-1"
}
export declare class AdminFindAllUserDto extends PaginationDto {
    query: string;
    sort: Sort[];
}
export {};
