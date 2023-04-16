import { User, UserDocument } from '@/user/schema/user.schema';
import {
  ForbiddenException,
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
import {
  RequestApprove,
  RequestApproveDocument,
} from './schema/request-aprrove.schema';
import { RequestApproveDto } from './dto/request-approve.dto';
import { ApproveFindAllDto } from './dto/approve-request-find-all.dto';
import { Section, SectionDocument } from './schema/section.schema';
import { ApproveRequestStatus } from './enum';
import { Quiz, QuizDocument } from '@/question/schema/quiz.schema';
import { convertPriceToBigNumber } from '@/common/helpers/convertPriceToBigNumber';
import {
  GameHistory,
  GameHistoryDocument,
} from '@/game/entities/game-history.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private model: Model<CourseDocument>,
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
    @InjectModel(Enroll.name) private enrollModel: Model<EnrollDocument>,
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(RequestApprove.name)
    private requestApproveModel: Model<RequestApproveDocument>,
    @InjectModel(GameHistory.name)
    private gameHistoryModel: Model<GameHistoryDocument>,
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
      if (data.finalTest) {
        const finalTest = await this.quizModel.findOne({
          _id: new ObjectId(data.finalTest),
          courseId: new ObjectId(courseId),
        });
        if (finalTest) {
          data.finalTest = finalTest._id;
        }
      }
      const rs: any = await this.model.findOneAndUpdate(
        { _id: new ObjectId(courseId) },
        data,
        { new: true },
      );
      const approveRequest = await this.requestApproveModel.findOne({
        courseId: course._id,
      });
      if (approveRequest) {
        return {
          ...rs['_doc'],
          lastApproveRequestAt: approveRequest.lastRequestAt,
        };
      }
      return {
        ...rs['_doc'],
        lastApproveRequestAt: null,
      };
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
    const course = await this.model
      .findOne({
        _id: new ObjectId(courseId),
      })
      .populate('finalTest');

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
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: 'walletAddress',
          as: 'authors',
        },
      },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'courseId',
          as: 'ratings',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: '_category',
        },
      },
      // {
      //   $lookup: {
      //     from: 'requestapproves',
      //     localField: '_id',
      //     foreignField: 'courseId',
      //     as: 'approveReq',
      //   },
      // },
      {
        $project: {
          name: 1,
          courseId: 1,
          rating: 1,
          author: { $arrayElemAt: ['$authors', 0] },
          category: { $arrayElemAt: ['$_category', 0] },
          students: 1,
          price: 1,
          ratingCount: { $size: '$ratings' },
          approved: 1,
          thumbnail: 1,
          // lastApproveRequestAt: { $first: "$approveReq.lastRequestAt" }//{ $arrayElemAt: ['$approveReq', 0] },
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

  async myEnrollCourses(data: CourseFindAllDto, userId: string) {
    console.log(
      '🚀 ~ file: course.service.ts:225 ~ CourseService ~ myEnrollCourses ~ userId',
      userId,
    );
    const myEnrolls = await this.enrollModel.find({
      userId: new ObjectId(userId),
    });
    console.log(
      '🚀 ~ file: course.service.ts:228 ~ CourseService ~ myEnrollCourses ~ myEnrolls',
      myEnrolls,
    );
    if (myEnrolls.length === 0) {
      return {
        total: 0,
        data: [],
      };
    }
    const match: { [key: string]: any } = {
      _id: {
        $in: myEnrolls.map((e) => e.courseId),
      },
    };

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
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: 'walletAddress',
          as: 'authors',
        },
      },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'courseId',
          as: 'ratings',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: '_category',
        },
      },
      {
        $project: {
          name: 1,
          courseId: 1,
          rating: 1,
          author: { $arrayElemAt: ['$authors', 0] },
          category: { $arrayElemAt: ['$_category', 0] },
          students: 1,
          price: 1,
          ratingCount: { $size: '$ratings' },
          approved: 1,
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

  /// APPROVE REQUEST
  //CLIENT
  async requestApprove(data: RequestApproveDto, user: User) {
    const course = await this.validateOwner(data.id, user.walletAddress);
    const existRequest = await this.requestApproveModel.findOne({
      courseId: course._id,
      lastRequestAt: {
        $gte: new Date(
          Date.now() -
            Number(this.configService.get('REQUEST_APPROVE_GAP_TIME')),
        ),
      },
    });
    if (existRequest) {
      throw new HttpException(
        {
          message: 'You have send a request before',
          timeCanSendNewRequest:
            existRequest['createdAt']?.getTime() +
            Number(this.configService.get('REQUEST_APPROVE_GAP_TIME')),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.requestApproveModel.findOneAndUpdate(
      {
        courseId: course._id,
      },
      {
        ...data,
        courseId: course._id,
        lastRequestAt: new Date(),
        status: ApproveRequestStatus.PENDING,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async getMyPastRequest(user: User, filter: ApproveFindAllDto) {
    const match: any = {};
    if (filter.courseId) {
      match.courseId = new ObjectId(filter.courseId);
    } else {
      const courses = await this.model.find(
        { owner: { $regex: new RegExp(`${user.walletAddress}`, 'i') } },
        { _id: 1 },
      );
      match.courseId = { $in: courses.map((c) => c._id) };
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
      course.students = course.students + 1;
      await course.save();
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

    const price = convertPriceToBigNumber(
      course.price,
      Number(this.configService.get('USDT_DECIMAL')),
    ).toString();

    const signature = await this.web3Service.signToCreateCourse(
      price,
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
    const sections = await this.sectionModel.aggregate([
      {
        $match: {
          courseId: new ObjectId(courseId),
        },
      },
      {
        $lookup: {
          from: 'lessons',
          localField: '_id',
          foreignField: 'sectionId',
          as: 'lessons',
        },
      },
      {
        $sort: {
          order: 1,
        },
      },
    ]);
    const requestApprove = await this.requestApproveModel.findOne({
      courseId: course._id,
    });

    return {
      ...course['_doc'],
      lastApproveRequestAt: requestApprove?.lastRequestAt || null,
      sections,
    };
  }

  async getCourseList(data: CourseFindAllDto) {
    const match: { [key: string]: any } = {
      approved: true,
      courseId: { $gte: 1 },
    };

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
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: 'walletAddress',
          as: 'authors',
        },
      },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'courseId',
          as: 'ratings',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: '_category',
        },
      },
      {
        $project: {
          name: 1,
          courseId: 1,
          thumbnail: 1,
          rating: 1,
          author: { $arrayElemAt: ['$authors', 0] },
          category: { $arrayElemAt: ['$_category', 0] },
          students: 1,
          price: 1,
          ratingCount: { $size: '$ratings' },
        },
      },
      {
        $sort: sort,
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

  async getCoursePreview({ id }: CourseIdDto) {
    const match = {
      approved: true,
      courseId: { $gte: 1 },
      _id: new ObjectId(id),
    };
    const [course] = await this.model.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: 'walletAddress',
          as: 'authors',
        },
      },
      {
        $lookup: {
          from: 'ratings',
          localField: '_id',
          foreignField: 'courseId',
          as: 'ratings',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: '_category',
        },
      },
      // {
      //   $lookup: {
      //     from: 'sections',
      //     localField: '_id',
      //     foreignField: 'courseId',
      //     as: 'sections',
      //   },
      // },
      {
        $project: {
          name: 1,
          description: 1,
          overview: 1,
          promotionalVideo: 1,
          language: 1,
          courseId: 1,
          rating: 1,
          includes: 1,
          goals: 1,
          thumbnail: 1,
          requirements: 1,
          approved: 1,
          reviews: 1,
          include: 1,
          author: { $arrayElemAt: ['$authors', 0] },
          category: { $arrayElemAt: ['$_category', 0] },
          students: 1,
          price: 1,
          ratingCount: { $size: '$ratings' },
          sections: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    const sections = await this.sectionModel.aggregate([
      {
        $match: {
          courseId: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: 'lessons',
          localField: '_id',
          foreignField: 'sectionId',
          as: 'lessons',
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          order: 1,
          lessons: {
            name: 1,
            description: 1,
            mediaType: 1,
          },
        },
      },
      {
        $sort: {
          order: 1,
        },
      },
    ]);
    // console.log("🚀 ~ file: course.service.ts:665 ~ CourseService ~ getCoursePreview ~ sections", sections)
    course['sections'] = sections;
    return course;
  }

  async checkEnroll(userId: string, courseId: string) {
    const enroll = await this.enrollModel.count({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
    });
    return {
      enroll: enroll > 0,
    };
  }

  async learnCourse(userId: string, courseId: string) {
    // const checkEnroll = await this.checkEnroll(userId, courseId);
    // if (!checkEnroll.enroll) {
    //   throw new ForbiddenException();
    // }
    const course = await this.model
      .findOne({
        _id: new ObjectId(courseId),
      })
      .populate('finalTest')
      .lean();
    if (!course) {
      throw new NotFoundException();
    }
    const sections = await this.sectionModel.aggregate([
      {
        $match: {
          courseId: course._id,
        },
      },
      {
        $lookup: {
          from: 'lessons',
          let: { sectionId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$sectionId', '$$sectionId'] },
              },
            },
            {
              $sort: {
                order: 1,
              },
            },
          ],
          as: 'lessons',
        },
      },
      {
        $sort: {
          order: 1,
        },
      },
    ]);

    // console.log("🚀 ~ file: course.service.ts:665 ~ CourseService ~ getCoursePreview ~ sections", sections)
    course['sections'] = sections;
    // const quizIds: ObjectId[] = []

    // for (let i = 0; i < sections.length; i++) {
    //   for (let j = 0; j < sections[i].lessons.length; j++) {
    //     if (sections[i].lessons.quizzes?.length)
    //       quizIds.push(...sections[i].lessons.quizzes)
    //   }
    // }

    for (let i = 0; i < sections.length; i++) {
      for (let j = 0; j < sections[i].lessons.length; j++) {
        if (sections[i].lessons[j].quizzes?.length) {
          const quizzesList = await this.quizModel.aggregate([
            {
              $match: {
                _id: {
                  $in: sections[i].lessons[j].quizzes.map(
                    (item: string) => new ObjectId(item),
                  ),
                },
              },
            },
            {
              $lookup: {
                from: 'gamehistories',
                let: { quizId: '$_id', userId: userId },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$quizId', '$$quizId'] },
                          { $eq: ['$userId', '$$userId'] },
                        ],
                      },
                    },
                  },
                ],
                as: 'gameRecords',
              },
            },
            {
              $addFields: {
                play: {
                  $cond: [{ $gt: [{ $size: '$gameRecords' }, 0] }, true, false],
                },
              },
            },
            {
              $project: {
                _id: 1,
                questions: 1,
                courseId: 1,
                name: 1,
                createdAt: 1,
                updatedAt: 1,
                play: true,
              },
            },
          ]);

          sections[i].lessons[j].quizzes = quizzesList;
        }
        sections[i].lessons[j].learned =
          !!sections[i].lessons[j]?.quizzes[0].play;
      }
    }

    // console.log(course.finalTest?.['_id']);

    if (course.finalTest?.['_id']) {
      const checkPlayFinalQuiz = await this.gameHistoryModel.findOne({
        userId: userId,
        quizId: course.finalTest?.['_id'],
      });
      course.finalTest['play'] = Boolean(checkPlayFinalQuiz);
    }

    return {
      ...course,
      sections,
    };
  }
}
