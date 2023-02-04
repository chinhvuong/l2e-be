import { User, UserDocument } from '@/user/schema/user.schema';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryService } from './category.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course, CourseDocument } from './schema/course.schema';
import { ObjectId } from 'mongodb';
import { CourseFindAllDto } from './dto/course-find-all.dto';

import {
  RequestApprove,
  RequestApproveDocument,
} from './schema/request-aprrove.schema';
import { ApproveFindAllDto } from './dto/approve-request-find-all.dto';
import { ResolveApproveRequestDto } from './dto/resolve-approve-request.dto';

@Injectable()
export class AdminCourseService {
  constructor(
    @InjectModel(Course.name)
    private model: Model<CourseDocument>,
    @InjectModel(RequestApprove.name)
    private requestApproveModel: Model<RequestApproveDocument>,
    private readonly categoryService: CategoryService,
  ) {}

  async findAll(data: CourseFindAllDto) {
    const match: { [key: string]: any } = {};

    if (data.query) {
      match.name = new RegExp(data.query, 'i');
    }
    if (data.category) {
      match.category = new ObjectId(data.category);
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

    const rs = await this.model.aggregate([
      { $match: match },
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

  async findOneAndUpdate(...args) {
    return await this.model.findOneAndUpdate(...args);
  }

  async findOne(...args) {
    return await this.model.findOne(...args);
  }

  async resolveApproveRequest(id: string, data: ResolveApproveRequestDto) {
    const rs = await this.requestApproveModel.findByIdAndUpdate(
      {
        _id: new ObjectId(id),
      },
      data,
      {
        new: true,
      },
    );

    return rs;
  }

  // admin
  //admin
  async getApproveRequests(filter: ApproveFindAllDto) {
    const match: any = {};
    if (filter.courseId) {
      match.courseId = new ObjectId(filter.courseId);
    }
    if (filter.status) {
      match.status = filter.status;
    }

    const pagination: any[] = [];
    if (filter.page !== undefined && filter.limit !== undefined) {
      pagination.push({
        $skip: filter.limit * filter.page,
      });
    }
    if (filter.limit !== undefined) {
      pagination.push({
        $limit: filter.limit,
      });
    }

    const rs = await this.requestApproveModel.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $project: {
          courseId: 1,
          createdAt: 1,
          status: 1,
          course: { $arrayElemAt: ['$course', 0] },
        },
      },
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

  async unApprovedCourses(data: CourseFindAllDto) {
    const match: { [key: string]: any } = {
      approved: false,
    };

    if (data.query) {
      match.name = new RegExp(data.query, 'i');
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

    const rs = await this.model.aggregate([
      { $match: match },
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

  async toggleApproveCourse(id: string) {
    const course = await this.model.findOne({
      _id: new ObjectId(id),
    });

    if (!course) {
      throw new NotFoundException();
    }
    course.approved = !course.approved;
    return await course.save();
  }
}
