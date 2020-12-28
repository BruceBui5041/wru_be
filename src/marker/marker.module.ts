import { Module } from '@nestjs/common';
import { MarkerService } from './marker.service';
import { MarkerResolver } from './marker.resolver';

@Module({
  providers: [MarkerService, MarkerResolver]
})
export class MarkerModule {}
