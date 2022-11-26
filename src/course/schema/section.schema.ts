import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Course } from './course.schema';
export type SectionDocument = Section & Document;

@Schema({
  timestamps: true,
})
export class Section {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: Course;

  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  description: string;

  @Prop({})
  order: number;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
