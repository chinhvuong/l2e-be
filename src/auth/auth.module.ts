import { UserModule } from '@/user/user.module';
import { Web3Module } from '@/web3/web3.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshAuthGuard } from './strategies/refresh.guard';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [JwtModule, UserModule, Web3Module],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshStrategy,
    JwtStrategy,
    RefreshAuthGuard,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
