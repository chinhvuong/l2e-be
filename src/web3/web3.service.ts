import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';

@Injectable()
export class Web3Service {
  public readonly web3: Web3;

  constructor() {
    this.web3 = new Web3();
  }
  recoverPersonalSignature(data: string, signature: string) {
    return this.web3.eth.accounts.recover(data, signature);
  }
}
