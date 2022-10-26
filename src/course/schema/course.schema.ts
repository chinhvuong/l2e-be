import { language } from '@/course/enum';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Category } from './category.schema';
import * as mongoose from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({
  timestamps: true,
})
export class Course {
  @Prop({ index: true, unique: true, sparse: true })
  course_id: number;

  @Prop({ nullable: false })
  owner: string;

  @Prop({ nullable: false })
  author: string;

  @Prop({ default: null, trim: true })
  name: string;

  @Prop({ default: '' })
  overview: string;

  @Prop({ default: '', trim: true })
  description: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviews: number;

  @Prop({ default: 0 })
  students: number;

  @Prop({ default: language.EN })
  language: language;

  @Prop({ default: false })
  approved: boolean;

  @Prop({ default: [] })
  requirements: string[];

  @Prop({ default: [] })
  goals: string[];

  @Prop({ default: null })
  thumbnail: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop(
    raw({
      duration: { type: String },
      resource: { type: String },
      assignments: { type: String },
      certificate: { type: String },
      lifetimeAccess: { type: String },
      device: { type: String },
      articles: { type: String },
      exercise: { type: String },
    }),
  )
  include: Record<any, any>;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
