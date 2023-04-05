import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BalanceDocument = Balance & Document;

@Schema({
  timestamps: true,
})
export class Balance {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 0 })
  lockBalance: number;

  @Prop({ default: null })
  lastLock: Date;
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);
