import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World to L2E BE! Hello I am Chinh Hello';
  }
}
