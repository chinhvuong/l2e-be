import { Course } from '@/course/schema/course.schema';
import { User } from '@/user/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CERTIFICATE_STATUS, GRADUATION_TYPE } from '../enum';

export type CertificateDocument = Certificate & Document;

@Schema({
  timestamps: true,
})
export class Certificate {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course: Course;

  @Prop({ required: true })
  courseId: number;

  @Prop({ default: null })
  image: string;

  @Prop()
  finalGrade: number;

  @Prop({
    default: GRADUATION_TYPE.A,
  })
  graduation: GRADUATION_TYPE;

  @Prop()
  tokenId: number;

  @Prop({
    default: CERTIFICATE_STATUS.OFF_CHAIN,
  })
  status: CERTIFICATE_STATUS;

  @Prop({
    default: null,
  })
  lastLock: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
