import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserProfileRepository) private readonly userProfileRepo: UserProfileRepository,
  ) {}

  async fetchUserProfile(user: User): Promise<User> {
    user.profile = await this.userProfileRepo.findOne({ owner: user });
    return user;
  }
}
