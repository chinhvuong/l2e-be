import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(data: LoginDto) {
    return data;
  }

  async refreshToken(data: RefreshTokenDto) {
    return data;
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
