import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, AdminUserService],
  exports: [UserService],
  controllers: [UserController, AdminUserController],
})
export class UserModule {}
