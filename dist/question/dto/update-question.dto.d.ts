export declare class ChoiceDto {
    content: string;
}
export declare class UpdateQuestionDto {
    question: string;
    medias: string[];
    choices: ChoiceDto[];
    correctAnswer: number;
}
