import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { GqlGetUser } from '../auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from '../auth/guards/auth.guard.gql';
import { User } from '../user/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { FetchMyGroupsDto } from './dto/fetch-my-groups.dto';
import { Group } from './group.entity';
import { GroupGraphQLType } from './group.gql.type';
import { GroupService } from './group.service';

@Resolver(type => GroupGraphQLType)
export class GroupResolver {
  constructor(private readonly groupService: GroupService, private readonly authService: AuthService) {}

  @Query(returns => [GroupGraphQLType])
  @UseGuards(GqlAuthGuard)
  fetchMyGroups(
    @GqlGetUser() user: User,
    @Args({ name: 'fetchingOptions', type: () => FetchMyGroupsDto }, ValidationPipe)
    fetchMyGroupsDto: FetchMyGroupsDto,
  ): Promise<Group[]> {
    return this.groupService.fetchMyGroups(user, fetchMyGroupsDto);
  }

  @Mutation(returns => GroupGraphQLType)
  @UseGuards(GqlAuthGuard)
  createGroup(
    @GqlGetUser() user: User,
    @Args({ name: 'createGroupInput', type: () => CreateGroupDto }, ValidationPipe)
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return this.groupService.createGroup(user, createGroupDto);
  }
}
