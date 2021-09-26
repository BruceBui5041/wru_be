import { Module } from '@nestjs/common';
import { MarkerService } from './marker.service';
import { MarkerResolver } from './marker.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/user/user.repository';
import { MarkerRepository } from './marker.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JouneyRepository } from 'src/jouney/jouney.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MarkerRepository, UserRepository, JouneyRepository]), AuthModule],
  providers: [MarkerService, MarkerResolver],
})
export class MarkerModule {}
