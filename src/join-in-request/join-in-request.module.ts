import { Module } from '@nestjs/common';
import { JoinInRequestService } from './join-in-request.service';
import { JoinInRequestResolver } from './join-in-request.resolver';

@Module({
  providers: [JoinInRequestService, JoinInRequestResolver]
})
export class JoinInRequestModule {}
