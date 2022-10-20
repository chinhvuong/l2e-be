import { Quiz } from '@/question/schema/quiz.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { lessonMode, mediaType } from '../enum';
import { Section } from './section.schema';
export type LessonDocument = Lesson & Document;

@Schema({
  timestamps: true,
})
export class Lesson {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Section' })
  sectionId: Section;

  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  media: string;

  @Prop({ default: mediaType.VIDEO })
  mediaType: mediaType;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }] })
  quizzes: Quiz[];

  @Prop({ default: lessonMode.ONLY_OWNER })
  mode: lessonMode;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
