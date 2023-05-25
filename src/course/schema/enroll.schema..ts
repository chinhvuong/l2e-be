import { User } from '@/user/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Course } from './course.schema';
export type EnrollDocument = Enroll & Document;

@Schema({
  timestamps: true,
})
export class Enroll {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: Course;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ default: 0 })
  price: number;
}

export const EnrollSchema = SchemaFactory.createForClass(Enroll);
