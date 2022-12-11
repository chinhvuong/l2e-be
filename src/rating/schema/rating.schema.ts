import { Course } from '@/course/schema/course.schema';
import { User } from '@/user/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RatingDocument = Rating & Document;

@Schema({
  timestamps: true,
})
export class Rating {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: Course;

  @Prop({ default: 5 })
  rating: number;

  @Prop({ default: '' })
  comment: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
