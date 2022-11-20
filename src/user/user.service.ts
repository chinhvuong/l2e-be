import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async findOneOrCreate(walletAddress: string) {
    return await this.model.findOneAndUpdate(
      { walletAddress: { $regex: new RegExp(walletAddress, 'i') } },
      {
        walletAddress: walletAddress,
      },
      { upsert: true, new: true },
    );
  }

  async findOneBy(...args) {
    return await this.model.findOne(...args).exec();
  }
}
