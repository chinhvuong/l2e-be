import { GRADUATION_TYPE } from '../enum';

export class CreateCertificateDto {
  user: string;
  course: string;
  courseId: number;
  finalGrade: number;
  graduation: GRADUATION_TYPE;
}
