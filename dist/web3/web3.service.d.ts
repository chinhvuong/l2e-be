import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import * as ethers from 'ethers';
export declare class Web3Service {
    private readonly configService;
    readonly web3: Web3;
    readonly operator: ethers.Wallet;
    constructor(configService: ConfigService);
    recoverPersonalSignature(data: string, signature: string): string;
    signToCreateCourse(price: any, nonce: any, senderAddress: any): Promise<ethers.ethers.Signature>;
}
