import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CategoryDocument = Category & Document;

@Schema({
  timestamps: true,
})
export class Category {
  @Prop({ default: null })
  name: string;

  @Prop({ unique: true, nullable: false })
  slug: string;

  @Prop({ nullable: false })
  banner: string;

  @Prop({ default: null })
  thumbnail: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
