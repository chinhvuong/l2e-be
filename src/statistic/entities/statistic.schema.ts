import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatisticDocument = Statistic & Document;

@Schema({
  timestamps: true,
})
export class Statistic {
  @Prop()
  time: Date;

  @Prop({ default: 0 })
  userCount: number;

  @Prop({ default: 0 })
  courseCount: number;

  @Prop({ default: 0 })
  certificateCount: number;

  @Prop({ default: 0 })
  revenue: number;
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);
