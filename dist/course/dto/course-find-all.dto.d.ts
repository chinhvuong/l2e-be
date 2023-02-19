declare enum Sort {
    PRICE_ASC = "price:1",
    RATING_ASC = "ratingCount:1",
    STUDENT_ASC = "students:1",
    PRICE_DESC = "price:-1",
    RATING_DESC = "ratingCount:-1",
    STUDENT_DESC = "students:-1"
}
export declare class CourseFindAllDto {
    limit: number;
    page: number;
    query: string;
    approved: boolean[];
    category: string;
    sort: Sort[];
}
export {};
