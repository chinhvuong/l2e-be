// import { getContract } from "../../src/utils"
import { Contract, EventData } from 'web3-eth-contract';
import Web3 from 'web3';

export abstract class BaseCrawler {
  public contractAddress: string;
  public provider: string;
  public chainId: number;
  public abi: any;
  public web3Contract: Contract;
  public startBlock: number;
  public name: string;
  public gapTime: number;
  public maxBlockRange: number;
  public web3: Web3;

  constructor(
    provider: string,
    contractAddress: string,
    abi: any,
    chainId: number,
    name: string,
    gapTime = 60000,
    maxBlockRange = 3000,
  ) {
    this.provider = provider;
    this.contractAddress = contractAddress;
    this.abi = abi;
    this.chainId = chainId;
    this.web3 = new Web3(provider);
    this.web3Contract = new this.web3.eth.Contract(abi, contractAddress);
    // this.startBlock = startBlock;
    this.name = name;
    this.maxBlockRange = maxBlockRange;
    this.gapTime = gapTime;
  }

  async crawlBlock(fromBlock: number, toBlock: number) {
    try {
      console.log('====================================');
      console.log('from', fromBlock);
      console.log('to', toBlock);
      console.log(this.name, ' ==> chain ID: ', this.chainId);
      console.log('====================================');
      const events = await this.web3Contract.getPastEvents('AllEvents', {
        fromBlock,
        toBlock,
      });
      for (const event of events) {
        await this.handleEvent(event);
      }
      await this.saveBlock(this.chainId, this.contractAddress, toBlock);
    } catch (error) {
      console.log(
        '🚀 ~ file: base.crawler.ts ~ line 43 ~ BaseCralwer ~ crawlBlock ~ error',
        error,
      );
      return;
    }
  }

  abstract handleEvent(event: EventData): Promise<void>;

  abstract saveBlock(
    chainId: number,
    contract: string,
    blockNumber: number,
  ): Promise<void>;

  async sleep(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  async timeout(fn: Function) {
    while (true) {
      await fn();
      await this.sleep(this.gapTime);
    }
  }

  abstract getNewestBlock(): Promise<number>;
  abstract getLatestCrawledBlock(): Promise<number>;

  async scan() {
    this.startBlock = await this.getLatestCrawledBlock();
    console.log(
      '🚀 ~ file: base.crawler.ts:89 ~ BaseCrawler ~ scan ~ startBlock:',
      this.startBlock,
    );

    await this.timeout(async () => {
      try {
        const newestBlock = await this.getNewestBlock();
        console.log(
          '🚀 ~ file: base.crawler.ts ~ line 75 ~ BaseCrawler ~ awaitthis.timeout ~ newestBlock',
          newestBlock,
        );
        const toBlock = Math.min(
          newestBlock,
          this.startBlock + this.maxBlockRange,
        );
        // console.log("Start Block", this.startBlock, "to Block", toBlock);
        if (toBlock > this.startBlock) {
          await this.crawlBlock(this.startBlock, toBlock);
          this.startBlock = toBlock + 1;
        } else {
          console.log(this.startBlock, toBlock);
        }
      } catch (error) {}
    });
  }
}
