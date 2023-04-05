import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Balance, BalanceDocument } from './entities/balance.schema';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name) private model: Model<BalanceDocument>,
  ) {}

  async upsertBalance(userId: string, amount: number) {
    return this.model.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $inc: { balance: amount },
      },
      {
        new: true,
        upsert: true,
        clean: true,
      },
    );
  }

  async lockBalance(userId: string, amount: number) {
    return this.model.findOneAndUpdate(
      {
        userId: userId,
      },
      {
        $inc: { lockBalance: amount, balance: -amount },
        lastLock: new Date(),
      },
      {
        new: true,
        upsert: true,
        clean: true,
      },
    );
  }

  async getUserBalance(userId: string) {
    const rs = await this.model.findOne({
      userId: userId,
    });

    if (!rs?._id) {
      return {
        balance: 0,
        lockBalance: 0,
      };
    }
    return {
      balance: rs.balance,
      lockBalance: rs.lockBalance,
    };
  }
}
