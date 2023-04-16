import { BalanceService } from '@/balance/balance.service';
import { BlockService } from '@/block/block.service';
import { CourseService } from '@/course/course.service';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { providers } from 'ethers';
import { EventData } from 'web3-eth-contract';
import { BaseCrawler } from './base.crawler';
import courseDexApi from '@/config/abi/course';
import { CertificateService } from '@/certificate/certificate.service';
import { CERTIFICATE_STATUS } from '@/certificate/enum';
@Injectable()
class CourseCrawler extends BaseCrawler {
  decimal = 10 ** 18;

  constructor(
    private readonly blockService: BlockService,
    private readonly courseService: CourseService,
    private readonly balanceService: BalanceService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly certificateService: CertificateService,
  ) {
    // const config = {
    //   provider: String(this.configService.get('RPC_PROVIDER')),
    //   contractAddress: String(this.configService.get('CONTRACT_ADDRESS')),
    //   abi: courseDexApi,
    //   chainId: Number(this.configService.get('CHAIN_ID')),
    //   name: "Course dex crawler",
    //   gapTime: 5000,
    //   maxBlockRange: 100,
    // }
    super(
      String(configService.get('RPC_PROVIDER')),
      String(configService.get('CONTRACT_ADDRESS')),
      courseDexApi,
      Number(configService.get('CHAIN_ID')),
      'Course dex crawler',
      60000,
      100,
    );
  }

  async getNewestBlock(): Promise<number> {
    return await this.web3.eth.getBlockNumber();
  }

  async getLatestCrawledBlock(): Promise<number> {
    const startBlock = this.configService.get('START_BLOCK');
    const lastCrawlBlock = await this.blockService.getLatestBlockNumber(
      Number(this.configService.get('CHAIN_ID')),
      String(this.configService.get('CONTRACT_ADDRESS')),
    );
    if (startBlock > lastCrawlBlock) {
      return startBlock; // first time
    }
    return lastCrawlBlock;
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
    console.log(
      '🚀 ~ file: course.crawler.ts:136 ~ CourseCrawler ~ handleClaimCertificateEvent ~ data:',
      data,
    );
    //   event ClaimCertificate (
    //     address indexed student,
    //     uint256 courseId,
    //     uint256 tokenId
    // );
    const user = await this.userService.findOneBy({
      walletAddress: data.student,
    });

    if (!user) {
      return;
    }
    const rs = await this.certificateService.updateCertificate(
      user._id,
      data.courseId,
      {
        tokenId: data.tokenId,
        status: CERTIFICATE_STATUS.ON_CHAIN,
      },
    );
    console.log(rs);
  }

  private async handleClaimRewardEvent(event: EventData) {
    const data = event.returnValues;
    console.log(
      '🚀 ~ file: course.crawler.ts:135 ~ CourseCrawler ~ handleClaimRewardEvent ~ data:',
      data,
    );
    const user = await this.userService.findOneBy({
      walletAddress: data.student,
    });
    if (!user) {
      return;
    }
    await this.balanceService.downLockBalance(
      user._id.toString(),
      data.amount / this.decimal,
    );
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
