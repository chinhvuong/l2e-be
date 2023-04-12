import { Question } from '@/question/schema/question.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { GAME_STATUS } from '../enum';

export type GameHistoryDocument = GameHistory & Document;

@Schema({
  timestamps: true,
})
export class GameHistory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' })
  quizId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ default: [] })
  questions: Question[];

  @Prop({ default: 0 })
  earn: number;

  @Prop({ default: GAME_STATUS.INPROGRESS })
  status: GAME_STATUS;

  @Prop({
    type: [
      {
        questionId: { type: String },
        answer: { type: Number, default: 0 },
      },
    ],
    default: [],
  })
  answers: {
    questionId: string;
    answer: number;
  }[];

  @Prop()
  isPass: boolean;

  @Prop({
    default: false,
  })
  isFinalTest: boolean;

  @Prop({ default: 0 })
  win_rate: number;

  @Prop({ type: Date })
  completeAt: Date;

  @Prop({ type: Date })
  expiredAt: Date;
}

export const GameHistorySchema = SchemaFactory.createForClass(GameHistory);
