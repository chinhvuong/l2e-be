import { BlockService } from '@/block/block.service';
import { CourseService } from '@/course/course.service';
import { EventData } from 'web3-eth-contract';
import { BaseCrawler } from './base.crawler';
declare class CourseCrawler extends BaseCrawler {
    blockService: BlockService;
    courseService: CourseService;
    decimal: number;
    constructor(_blockService: BlockService, _courseService: CourseService, provider: string, contractAddress: string, abi: any, chainId: number, startBlock: number, name: string, gapTime?: number, maxBlockRange?: number);
    getNewestBlock(): Promise<number>;
    handleEvent(event: EventData): Promise<void>;
    private handleCreateCourseEvent;
    private handleCourseEnrollEvent;
    private handleCourseTransferOwnerEvent;
    private handleClaimCertificateEvent;
    private handleClaimRewardEvent;
    private handleCoursePriceEditedEvent;
    saveBlock(chainId: number, contract: string, blockNumber: number): Promise<void>;
}
export default CourseCrawler;
