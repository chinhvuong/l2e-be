import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schema/user.schema';
import { ObjectId } from 'mongodb';
import { AdminFindAllUserDto } from './dto/admin-find-all.dto';

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

  async list(data: AdminFindAllUserDto) {
    const match: { [key: string]: any } = {};

    if (data.query) {
      match['$or'] = [
        { walletAddress: new RegExp(data.query, 'i') },
        { name: new RegExp(data.query, 'i') },
      ];
    }
    const pagination: any[] = [];
    if (data.page !== undefined && data.limit !== undefined) {
      pagination.push({
        $skip: data.limit * data.page,
      });
    }
    if (data.limit !== undefined) {
      pagination.push({
        $limit: data.limit,
      });
    }
    const sort: { [key: string]: 1 | -1 } = {};
    // sort
    if (data?.sort?.length) {
      for (let i = 0; i < data?.sort?.length; i++) {
        const [attr, direction] = data.sort[i].split(':');
        if (direction === '-1') {
          sort[attr] = -1;
        } else {
          sort[attr] = 1;
        }
      }
    } else {
      // price desc
      sort.price = -1;
    }

    const rs = await this.model.aggregate([
      { $match: match },
      // {
      //   $lookup: {
      //     from: 'courses',
      //     localField: 'walletAddress',
      //     foreignField: 'author',
      //     as: 'courses',
      //   },
      // },

      // {
      //   $lookup: {
      //     from: 'enrolls',
      //     localField: '_id',
      //     foreignField: 'userId',
      //     as: 'enrolls',
      //   },
      // },
      {
        $project: {
          walletAddress: 1,
          name: 1,
          avatar: 1,
          bio: 1,
          title: 1,
          rating: 1,
          createdAt: 1,
          _id: 1,
          // courseCreated: { $size: '$courses' },
          // courseEnrolled: { $size: '$enrolls' },
        },
      },

      { $sort: sort },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: pagination,
        },
      },
    ]);
    return {
      total: rs[0]?.metadata[0] ? rs[0]?.metadata[0].total : 0,
      data: rs[0] ? rs[0].data : [],
    };
  }
}
