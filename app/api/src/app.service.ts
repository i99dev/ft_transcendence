import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  GetHello(): string {
    return 'Hello from Backend!';
  }
}
