import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfile } from './user-profile.entity';
import { UserProfileRepository } from './user-profile.repository';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfileRepository) private readonly userProfileRepo: UserProfileRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  async updateUserProfile(user: User, profileDto: UpdateProfileDto): Promise<UserProfile> {
    try {
      const existsProfile = await this.userProfileRepo.findOne({ owner: user });
      if (existsProfile) {
        return this.userProfileRepo.save({ uuid: existsProfile.uuid, ...profileDto });
      }

      const profile = new UserProfile();
      profile.createNewUserProfile(user, profileDto);
      await profile.save();
      await this.userRepo.update({ uuid: user.uuid }, { profile: profile });
      return profile;
    } catch (err) {
      throw err;
    }
  }
}
