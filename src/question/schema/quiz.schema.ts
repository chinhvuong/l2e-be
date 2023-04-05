import { Course } from '@/course/schema/course.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Question } from './question.schema';

export type QuizDocument = Quiz & Document;

@Schema({
  timestamps: true,
})
export class Quiz {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] })
  questions: Question[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ default: '' })
  name: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
