import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfile } from './user-profile.entity';
import { UserProfileRepository } from './user-profile.repository';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfileRepository)
    private readonly userProfileRepository: UserProfileRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async updateUserProfile(
    user: User,
    profileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    try {
      const existsProfile = await this.userProfileRepository.findOne({
        owner: { uuid: user.uuid },
      });
      if (existsProfile) {
        return this.userProfileRepository.save({
          uuid: existsProfile.uuid,
          ...profileDto,
        });
      }

      const profile = new UserProfile(user, profileDto);
      const newProfile = await profile.save();

      await this.userRepository.update(
        { uuid: user.uuid },
        { profile: newProfile },
      );
      return newProfile;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
