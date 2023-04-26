import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Course } from './course.schema';
export type RatingDocument = Rating & Document;

@Schema({
  timestamps: true,
})
export class Rating {
  @Prop({ default: '' })
  content: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Course' })
  course: Course;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: Course;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
