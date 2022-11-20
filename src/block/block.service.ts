import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Block, BlockDocument } from './schema/block.schema';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(Block.name)
    private model: Model<BlockDocument>,
  ) {}

  async findOneBy(...args) {
    return await this.model.findOne(...args).exec();
  }

  async createBlock(data: Partial<Block>) {
    return await new this.model({
      ...data,
    }).save();
  }

  async getLatestBlockNumber(chainId: number, contract: string) {
    const block = await this.model.findOne(
      {
        chainId,
        contract,
      },
      { blockNumber: 1 },
      { sort: { blockNumber: -1 } },
    );
    if (!block) {
      return 0;
    }
    return block.blockNumber;
  }
}
