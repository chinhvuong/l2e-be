export declare class ChoiceDto {
    content: string;
}
export declare class BaseCreateQuestionDto {
    question: string;
    medias: string[];
    choices: ChoiceDto[];
    correctAnswer: number;
}
export declare class CreateQuestionDto extends BaseCreateQuestionDto {
    courseId: string;
}
export declare class CreateListQuestionDto {
    data: BaseCreateQuestionDto[];
    courseId: string;
}
