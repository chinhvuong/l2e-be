import { UserDocument } from '@/user/schema/user.schema';
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
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFindAllDto } from './dto/course-find-all.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private model: Model<CourseDocument>,
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

  async createNewCourse(user: UserDocument, data: CreateCourseDto) {
    try {
      const category = await this.categoryService.findOne({
        _id: new ObjectId(data.category),
      });
      if (!category) {
        throw new HttpException(
          'Category does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await new this.model({
        owner: user.walletAddress,
        author: user.walletAddress,
        ...data,
        category: category._id,
      }).save();
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateCourse(
    user: UserDocument,
    data: UpdateCourseDto,
    courseId: string,
  ) {
    try {
      const course = await this.model.findOne({ _id: new ObjectId(courseId) });
      if (!course) {
        throw new HttpException(
          'Course does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (course.owner.toLowerCase() !== user.walletAddress.toLowerCase()) {
        throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
      }
      const rs = await this.model.findOneAndUpdate(
        { _id: new ObjectId(courseId) },
        data,
        { new: true },
      );
      return rs;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(...args) {
    return await this.model.findOne(...args);
  }

  async validateOwner(courseId: string, owner: string) {
    const course = await this.model.findOne({
      _id: new ObjectId(courseId),
    });
    if (!course) {
      throw new HttpException('Course does not exist', HttpStatus.BAD_REQUEST);
    }
    if (course.owner.toLowerCase() !== owner.toLowerCase()) {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
    }
    return course;
  }

  async ownCourses(data: CourseFindAllDto, ownerAddress: string) {
    const match: { [key: string]: any } = {
      owner: { $regex: new RegExp(ownerAddress, 'i') },
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

  // admin
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
