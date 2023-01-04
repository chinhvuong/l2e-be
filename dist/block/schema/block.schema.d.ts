import mongoose, { Document } from 'mongoose';
export declare type BlockDocument = Block & Document;
export declare class Block {
    blockNumber: number;
    chainId: number;
    contract: string;
}
export declare const BlockSchema: mongoose.Schema<Block, mongoose.Model<Block, any, any, any, any>, {}, {}, {}, {}, "type", Block>;
