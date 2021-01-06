import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileResolver } from './user-profile.resolver';

@Module({
  providers: [UserProfileService, UserProfileResolver],
})
export class UserProfileModule {}
