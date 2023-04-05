import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type DailyRewardDocument = DailyReward & Document;

@Schema({
  timestamps: true,
})
export class DailyReward {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ nullable: false })
  date: Date;

  @Prop({ default: 0 })
  reward: number;
}

export const DailyRewardSchema = SchemaFactory.createForClass(DailyReward);
