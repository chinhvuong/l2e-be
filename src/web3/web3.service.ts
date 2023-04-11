import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import * as ethers from 'ethers';
@Injectable()
export class Web3Service {
  public readonly web3: Web3;
  public readonly operator: ethers.Wallet;

  constructor(private readonly configService: ConfigService) {
    this.web3 = new Web3();
    this.operator = new ethers.Wallet(
      String(configService.get('OPERATOR_PRIVATEKEY')),
    );
  }
  recoverPersonalSignature(data: string, signature: string) {
    return this.web3.eth.accounts.recover(data, signature);
  }

  async signToCreateCourse(price: any, nonce: any, senderAddress: any) {
    const payload = ethers.utils.defaultAbiCoder.encode(
      ['uint256', 'uint256', 'address', 'address'],
      [price, nonce, senderAddress, this.configService.get('CONTRACT_ADDRESS')],
    );
    const payloadHash = ethers.utils.keccak256(payload);
    const signature = await this.operator.signMessage(
      ethers.utils.arrayify(payloadHash),
    );
    const sig = ethers.utils.splitSignature(signature);
    console.log('Signature:', sig);
    return sig;
  }

  async signToClaimRewardToken(
    amount: string,
    nonce: number,
    senderAddress: string,
  ) {
    const payload = ethers.utils.defaultAbiCoder.encode(
      ['uint256', 'uint256', 'address', 'address'],
      [
        amount,
        nonce,
        senderAddress,
        this.configService.get('CONTRACT_ADDRESS'),
      ],
    );
    const payloadHash = ethers.utils.keccak256(payload);
    const signature = await this.operator.signMessage(
      ethers.utils.arrayify(payloadHash),
    );
    const sig = ethers.utils.splitSignature(signature);
    console.log('Signature:', sig);
    return sig;
  }
}
