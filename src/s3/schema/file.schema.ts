import { User } from '@/user/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MediaFileDocument = MediaFile & Document;

@Schema({
  timestamps: true,
})
export class MediaFile {
  @Prop({ default: '' })
  url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  key: string;
}

export const MediaFileSchema = SchemaFactory.createForClass(MediaFile);
