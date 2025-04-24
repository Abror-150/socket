import { Module } from '@nestjs/common';
import { ChatGatAway } from './socketgatAway';

@Module({
  providers: [ChatGatAway],
})
export class SocketModule {}
