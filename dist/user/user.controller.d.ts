import { UserDocument } from '@/user/schema/user.schema';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    me(user: UserDocument): Promise<any>;
}
