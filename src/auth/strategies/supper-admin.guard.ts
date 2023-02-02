import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SupperAdmin implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return Boolean(process.env.ADMIN_ADDRESS?.toLowerCase().split(' ').includes(user?.walletAddress.toLowerCase()))
  }
}
