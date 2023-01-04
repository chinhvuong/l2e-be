import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { UserDocument } from '@/user/schema/user.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(data: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(data: RefreshTokenDto, user: UserDocument): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
