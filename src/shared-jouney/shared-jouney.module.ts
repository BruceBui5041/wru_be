import { Module } from '@nestjs/common';
import { SharedJouneyService } from './shared-jouney.service';
import { SharedJouneyResolver } from './shared-jouney.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PubSubModule } from 'src/pub-sub/pub-sub.module';
import { JouneyRepository } from 'src/jouney/jouney.repository';
import { UserRepository } from 'src/user/user.repository';
import { SharedJouneyRepository } from './shared-jouney.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JouneyRepository,
      UserRepository,
      SharedJouneyRepository,
    ]),
    AuthModule,
  ],
  providers: [SharedJouneyService, SharedJouneyResolver],
})
export class SharedJouneyModule {}
