import { BlockService } from '@/block/block.service';
import { CourseService } from '@/course/course.service';
import { EventData } from 'web3-eth-contract';
import { BaseCrawler } from './base.crawler';

class CourseCrawler extends BaseCrawler {
  blockService: BlockService;
  courseService: CourseService;
  decimal = 10 ** 18;

  constructor(
    _blockService: BlockService,
    _courseService: CourseService,
    provider: string,
    contractAddress: string,
    abi: any,
    chainId: number,
    startBlock: number,
    name: string,
    gapTime = 60000,
    maxBlockRange = 500,
  ) {
    super(
      provider,
      contractAddress,
      abi,
      chainId,
      startBlock,
      name,
      gapTime,
      maxBlockRange,
    );
    this.blockService = _blockService;
    this.courseService = _courseService;
  }

  async getNewestBlock(): Promise<number> {
    return await this.web3.eth.getBlockNumber();
  }

  async handleEvent(event: EventData): Promise<void> {
    console.log(event.event, event.returnValues);
    switch (event.event) {
      case 'CourseCreated': {
        this.handleCreateCourseEvent(event);
        break;
      }

      case 'CoursePriceEdited': {
        this.handleCoursePriceEditedEvent(event);
        break;
      }
      case 'CourseTransferOwner': {
        this.handleCourseTransferOwnerEvent(event);
        break;
      }

      case 'CourseEnroll': {
        this.handleCourseEnrollEvent(event);
        break;
      }

      case 'ClaimCertificate': {
        this.handleClaimCertificateEvent(event);
        break;
      }

      case 'ClaimReward': {
        this.handleClaimRewardEvent(event);
        break;
      }
    }
  }

  private async handleCreateCourseEvent(event: EventData) {
    const data = event.returnValues;
    console.log({
      owner: data.owner,
      courseId: undefined,
      price: data.price / this.decimal,
      approved: false,
    });

    await this.courseService.findOneAndUpdate(
      {
        owner: data.owner,
        courseId: { $exists: false },
        price: data.price / this.decimal,
        approved: true,
      },
      {
        courseId: data.courseId,
      },
    );
  }

  private async handleCourseEnrollEvent(event: EventData) {
    const data = event.returnValues;
    await this.courseService.enrollCourse(data.student, Number(data.courseId));
  }

  private async handleCourseTransferOwnerEvent(event: EventData) {
    const data = event.returnValues;

    await this.courseService.findOneAndUpdate(
      {
        courseId: data.courseId,
      },
      {
        owner: data.newOwner,
      },
    );
  }

  private async handleClaimCertificateEvent(event: EventData) {
    const data = event.returnValues;
  }

  private handleClaimRewardEvent(event: EventData) {
    const data = event.returnValues;
  }

  private async handleCoursePriceEditedEvent(event: EventData) {
    const data = event.returnValues;
    await this.courseService.findOneAndUpdate(
      {
        courseId: data.courseId,
      },
      {
        price: data.newPrice / this.decimal,
      },
    );
  }

  async saveBlock(
    chainId: number,
    contract: string,
    blockNumber: number,
  ): Promise<void> {
    await this.blockService.createBlock({
      chainId,
      contract,
      blockNumber,
    });
  }
}

export default CourseCrawler;
