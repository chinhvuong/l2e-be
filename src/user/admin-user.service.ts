import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminFindAllUserDto } from './dto/admin-find-all.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class AdminUserService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async findAll(data: AdminFindAllUserDto) {
    const match: { [key: string]: any } = {};

    if (data.query) {

      match['$or'] = [
        { walletAddress: new RegExp(data.query, 'i'), },
        { name: new RegExp(data.query, 'i'), }
      ]
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
    const sort: { [key: string]: 1 | -1 } = {}
    // sort
    if (data?.sort?.length) {
      for (let i = 0; i < data?.sort?.length; i++) {
        const [attr, direction] = data.sort[i].split(':');
        if (direction === '-1') {
          sort[attr] = -1
        } else {
          sort[attr] = 1
        }
      }
    } else { // price desc
      sort.price = -1
    }

    const rs = await this.model.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'courses',
          localField: 'walletAddress',
          foreignField: 'author',
          as: 'courses',
        },
      },

      {
        $lookup: {
          from: 'enrolls',
          localField: '_id',
          foreignField: 'userId',
          as: 'enrolls',
        },
      },
      {
        $project: {
          walletAddress: 1,
          name: 1,
          avatar: 1,
          bio: 1,
          title: 1,
          rating: 1,
          createdAt: 1,
          courseCreated: { $size: "$courses" },
          courseEnrolled: { $size: "$enrolls" }
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

  async findOneBy(...args) {
    return await this.model.findOne(...args).exec();
  }
}
