import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileResolver } from './user-profile.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileRepository } from './user-profile.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfileRepository, UserRepository])],
  providers: [UserProfileService, UserProfileResolver],
})
export class UserProfileModule {}
