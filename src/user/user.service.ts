import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserProfileRepository)
    private readonly userProfileRepo: UserProfileRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async fetchUserProfile(user: User): Promise<User> {
    user.profile = await this.userProfileRepo.findOne({ owner: user });
    return user;
  }

  async searchUsers(searchQuery: string): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder()
      .select()
      .where(`MATCH(username) AGAINST ('${searchQuery}*' IN BOOLEAN MODE)`)
      .orWhere(`MATCH(email) AGAINST ('${searchQuery}*' IN BOOLEAN MODE)`)
      .getMany();
  }
}
