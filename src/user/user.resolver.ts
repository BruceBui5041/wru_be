import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GqlMatchStoredTokenGuard } from '../auth/guards/match-token.guard.gql';
import { UpdateProfileDto } from '../user-profile/dto/update-profile.dto';
import { UserProfileService } from '../user-profile/user-profile.service';
import { AuthService } from '../auth/auth.service';
import { GqlGetUser } from '../auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from '../auth/guards/auth.guard.gql';
import { User } from './user.entity';
import { UserGraphQLType } from './user.gql.type';
import { UserService } from './user.service';

@Resolver((type) => UserGraphQLType)
export class UserResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private userProfileService: UserProfileService,
  ) {}

  @Query((returns) => [UserGraphQLType])
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  searchUsers(
    @GqlGetUser() user: User,
    @Args({ name: 'searchQuery', type: () => String! })
    searchQuery: string,
  ): Promise<User[]> {
    return this.userService.searchUsers(user, searchQuery);
  }

  @Query((returns) => UserGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  fetchUserProfile(@GqlGetUser() user: User): Promise<User> {
    return this.userService.fetchUserProfile(user);
  }

  @Mutation((returns) => UserGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  async updateUserProfile(
    @GqlGetUser() user: User,
    @Args({ name: 'profile', type: () => UpdateProfileDto }, ValidationPipe)
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    user.profile = await this.userProfileService.updateUserProfile(
      user,
      updateProfileDto,
    );
    return user;
  }
}
