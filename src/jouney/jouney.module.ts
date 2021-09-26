import { Module } from '@nestjs/common';
import { JouneyService } from './jouney.service';
import { JouneyResolver } from './jouney.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { JouneyRepository } from './jouney.repository';

@Module({
  imports: [TypeOrmModule.forFeature([JouneyRepository, UserRepository]), AuthModule],
  providers: [JouneyService, JouneyResolver],
})
export class JouneyModule {}
