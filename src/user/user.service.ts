import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schema/user.schema';
import { ObjectId } from 'mongodb';

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

  async updateProfile(user: UserDocument, data: UpdateProfileDto) {
    return this.model.findOneAndUpdate(
      {
        _id: user._id,
      },
      data,
      {
        lean: true,
        new: true,
      },
    );
  }

  async getUserProfile(id: string) {
    const user = await this.model.findOne({
      _id: new ObjectId(id),
    });

    if (!user) {
      throw new NotFoundException();
    }
    return {
      ...user?.toObject(),
      password: undefined,
      nonce: undefined,
    };
  }
}
