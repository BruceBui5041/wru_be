import { Module } from '@nestjs/common';
import { JouneyService } from './jouney.service';
import { JouneyResolver } from './jouney.resolver';

@Module({
  providers: [JouneyService, JouneyResolver]
})
export class JouneyModule {}
