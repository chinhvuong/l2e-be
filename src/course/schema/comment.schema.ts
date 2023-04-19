import { Course } from '@/course/schema/course.schema';
import { Lesson } from '@/course/schema/lesson.schema';
import { User } from '@/user/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({
  timestamps: true,
})
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course: Course;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' })
  lesson: Lesson;

  @Prop({ trim: true })
  content: string;

  @Prop({ default: 0 })
  like: number;

  @Prop({ default: 1 })
  level: number;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } })
  relyTo: Comment;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  replies: Comment[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
