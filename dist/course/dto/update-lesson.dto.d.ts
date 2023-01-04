import { mediaType } from '../enum';
export declare class UpdateLessonDto {
    name: string;
    description: string;
    media: string;
    mediaType: mediaType;
    quizzes: string[];
    _id: string;
}
