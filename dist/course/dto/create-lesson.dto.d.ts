import { mediaType } from '../enum';
export declare class BaseCreateLessonDto {
    name: string;
    description: string;
    media: string;
    mediaType: mediaType;
    quizzes: string[];
}
export declare class CreateLessonDto extends BaseCreateLessonDto {
    sectionId: string;
}
export declare class CreateListLessonDto {
    data: BaseCreateLessonDto[];
    courseId: string;
}
