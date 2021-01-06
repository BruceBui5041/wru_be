import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { GqlGetUser } from '../auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from '../auth/guards/auth.guard.gql';
import { UserProfileGraphQLType } from '../user-profile/user-profile.gql.type';
import { User } from './user.entity';
import { UserGraphQLType } from './user.gql.type';

@Resolver(type => UserGraphQLType)
export class UserResolver {
  constructor(private authService: AuthService) {}

  @Query(returns => UserProfileGraphQLType)
  @UseGuards(GqlAuthGuard)
  async getUserInfo(@GqlGetUser() user: User): Promise<User> {
    return await this.authService.getUserProfile(user);
  }
}
