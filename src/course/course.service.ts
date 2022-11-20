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
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFindAllDto } from './dto/course-find-all.dto';
import { Enroll, EnrollDocument } from './schema/enroll.schema.';
import { UserService } from '@/user/user.service';
import { CourseIdDto } from './dto/course-id.dto';
import { Web3Service } from '@/web3/web3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private model: Model<CourseDocument>,
    @InjectModel(Enroll.name) private enrollModel: Model<EnrollDocument>,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly web3Service: Web3Service,
    private readonly configService: ConfigService,
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

  async findOneAndUpdate(...args) {
    return await this.model.findOneAndUpdate(...args);
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

  // enroll
  async enrollCourse(student: string, courseId: number) {
    const [course, user] = await Promise.all([
      await this.model.findOne({
        courseId: courseId,
      }),
      await this.userService.findOneOrCreate(student),
    ]);
    if (user && course) {
      return await new this.enrollModel({
        courseId: course._id,
        userId: user._id,
      }).save();
    }
  }

  // mint course
  async getSignatureToMintCourse(courseId: string, user: UserDocument) {
    const course = await this.validateOwner(courseId, user.walletAddress);

    if (course.courseId || isNaN(course.price) || course.approved === false) {
      throw new HttpException('No', HttpStatus.BAD_REQUEST);
    }

    console.log(Number(this.configService.get('USDT_DECIMAL')));

    const price =
      course.price * 10 ** Number(this.configService.get('USDT_DECIMAL'));
    const signature = await this.web3Service.signToCreateCourse(
      `${price}`,
      user.nonce,
      user.walletAddress,
    );
    user.nonce = user.nonce + 1;
    await user.save();
    return {
      price: `${price}`,
      v: signature.v,
      r: signature.r,
      s: signature.s,
      nonce: user.nonce - 1,
    };
  }

  async getCourseDetailToEdit(courseId: string, owner: string) {
    const course = await this.validateOwner(courseId, owner);

    return course;
  }
}
