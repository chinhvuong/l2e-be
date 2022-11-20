import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ unique: true, index: true })
  walletAddress: string;

  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  title: string;

  @Prop({ default: null })
  bio: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  nonce: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
