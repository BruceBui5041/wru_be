import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { compact } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserProfileRepository)
    private readonly userProfileRepository: UserProfileRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async fetchUserProfile(user: User): Promise<User> {
    user.profile = await this.userProfileRepository.findOne({ owner: user });
    return user;
  }

  async searchUsers(user: User, searchQuery: string): Promise<User[]> {
    let desired = searchQuery.replace(
      /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
      ' ',
    );

    desired = compact(desired.split(' ')).length == 0 ? '' : desired + '*';

    return await this.userRepository
      .createQueryBuilder()
      .select()
      .where(`username != '${user.username}'`)
      .andWhere(
        `(MATCH(username) AGAINST ('${desired}' IN BOOLEAN MODE) OR MATCH(email) AGAINST ('${desired}' IN BOOLEAN MODE))`,
      )
      .getMany();
  }
}
