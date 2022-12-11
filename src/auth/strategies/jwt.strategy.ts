import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '@/user/user.service';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOneBy({
      _id: new ObjectId(payload.userId),
    });
    if (!user) {
      throw new HttpException('User is not exist.', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
