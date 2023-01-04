import { Contract, EventData } from 'web3-eth-contract';
import Web3 from 'web3';
export declare abstract class BaseCrawler {
    contractAddress: string;
    provider: string;
    chainId: number;
    abi: any;
    web3Contract: Contract;
    startBlock: number;
    name: string;
    gapTime: number;
    maxBlockRange: number;
    web3: Web3;
    constructor(provider: string, contractAddress: string, abi: any, chainId: number, startBlock: number, name: string, gapTime?: number, maxBlockRange?: number);
    crawlBlock(fromBlock: number, toBlock: number): Promise<void>;
    abstract handleEvent(event: EventData): Promise<void>;
    abstract saveBlock(chainId: number, contract: string, blockNumber: number): Promise<void>;
    sleep(milliseconds: number): Promise<unknown>;
    timeout(fn: Function): Promise<void>;
    abstract getNewestBlock(): Promise<number>;
    scan(): Promise<void>;
}
