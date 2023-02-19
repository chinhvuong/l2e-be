import { AdminFindAllUserDto } from './dto/admin-find-all.dto';
import { AdminUserService } from './admin-user.service';
export declare class AdminUserController {
    private readonly userService;
    constructor(userService: AdminUserService);
    list(filter: AdminFindAllUserDto): Promise<{
        total: any;
        data: any;
    }>;
}
