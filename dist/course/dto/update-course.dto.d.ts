import { language } from '../enum';
export declare class CourseInclude {
    duration: string;
    resource: string;
    assignments: string;
    certificate: string;
    lifetimeAccess: string;
    device: string;
    articles: string;
    exercise: string;
}
export declare class UpdateCourseDto {
    name: string;
    overview: string;
    description: string;
    price: number;
    language: language;
    finalTest: string;
    requirements: string[];
    goals: string[];
    thumbnail: string;
    promotionalVideo: string;
    include: CourseInclude;
}
