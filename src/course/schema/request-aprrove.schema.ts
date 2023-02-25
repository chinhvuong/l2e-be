import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApproveRequestStatus } from '../enum';
import { Course } from './course.schema';
export type RequestApproveDocument = RequestApprove & Document;

@Schema({
  timestamps: true,
})
export class RequestApprove {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: Course;

  @Prop({ default: [] })
  notes: string[];

  @Prop({ default: ApproveRequestStatus.PENDING })
  status: ApproveRequestStatus;

  @Prop({ type: Date, default: Date.now })
  lastRequestAt: Date;
}

export const RequestApproveSchema =
  SchemaFactory.createForClass(RequestApprove);
