import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema({
  timestamps: true,
})
export class Question {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ default: '' })
  question: string;

  @Prop({ default: [] })
  medias: string[];

  @Prop({ default: [] })
  choices: {
    content: string;
    media: string;
  }[];

  @Prop({ default: 0 })
  correctAnswer: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
