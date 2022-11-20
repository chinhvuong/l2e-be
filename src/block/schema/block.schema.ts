import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type BlockDocument = Block & Document;

@Schema({
  timestamps: true,
})
export class Block {
  @Prop({ default: '' })
  blockNumber: number;

  @Prop()
  chainId: number;

  @Prop()
  contract: string;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
