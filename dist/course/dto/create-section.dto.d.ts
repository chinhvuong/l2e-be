export declare class ChoiceDto {
    content: string;
}
export declare class BaseCreateSectionDto {
    name: string;
    description: string;
}
export declare class CreateSectionDto extends BaseCreateSectionDto {
    courseId: string;
}
export declare class CreateListSectionDto {
    data: BaseCreateSectionDto[];
    courseId: string;
}
