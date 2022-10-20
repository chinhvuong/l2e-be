import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Course } from './course.schema';
export type SectionDocument = Section & Document;

@Schema({
  timestamps: true,
})
export class Section {
  @Prop({ default: null })
  courseId: Course;

  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  description: string;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
