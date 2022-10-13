import { UserDocument } from '@/user/schema/user.schema';
import { UserService } from '@/user/user.service';
import { Web3Service } from '@/web3/web3.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly web3Service: Web3Service,
  ) {}

  async login(data: LoginDto) {
    // verify signature
    let recoveredAddress = '';
    try {
      recoveredAddress = this.web3Service.recoverPersonalSignature(
        this.configService.get('LOGIN_MESSAGE').toString(),
        data.signature,
      );
    } catch (err) {
      throw new HttpException(
        'Problem with signature verification.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (recoveredAddress.toLowerCase() !== data.walletAddress.toLowerCase()) {
      throw new HttpException('Invalid signature', HttpStatus.FORBIDDEN);
    }
    const user = await this.userService.findOneOrCreate(data.walletAddress);
    console.log(
      '🚀 ~ file: auth.service.ts ~ line 41 ~ AuthService ~ login ~ user',
      user,
    );
    return this.getAuthToken(user._id.toString(), user.walletAddress);
  }

  async refreshToken(user: UserDocument) {
    return this.getAuthToken(user._id.toString(), user.walletAddress);
  }

  private getAuthToken(userId: string, address: string) {
    const payload = {
      userId,
      address,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: Number(this.configService.get('ACCESS_TOKEN_EXPIRE_TIME')),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: Number(this.configService.get('REFRESH_TOKEN_EXPIRE_TIME')),
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
