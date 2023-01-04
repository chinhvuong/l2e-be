import { UserDocument } from '@/user/schema/user.schema';
import { UserService } from '@/user/user.service';
import { Web3Service } from '@/web3/web3.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly configService;
    private readonly userService;
    private readonly web3Service;
    constructor(jwtService: JwtService, configService: ConfigService, userService: UserService, web3Service: Web3Service);
    login(data: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(user: UserDocument): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private getAuthToken;
}
