import { Module } from '@nestjs/common';
import { JouneyService } from './jouney.service';
import { JouneyResolver } from './jouney.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { JouneyRepository } from './jouney.repository';
import { MarkerRepository } from 'src/marker/marker.repository';
import { MarkerService } from 'src/marker/marker.service';
import { MarkerModule } from 'src/marker/marker.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([JouneyRepository, UserRepository, MarkerRepository]),
    AuthModule,
    MarkerModule,
  ],
  providers: [JouneyService, MarkerService, JouneyResolver],
})
export class JouneyModule {}
