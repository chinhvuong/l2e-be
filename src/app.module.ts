import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    MongooseModule.forRoot('mongodb://localhost/l2e'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
