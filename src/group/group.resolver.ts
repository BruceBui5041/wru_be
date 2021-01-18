import { Inject, UseGuards, ValidationPipe } from '@nestjs/common';
import { Query, Args, Mutation, Resolver, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { GqlMatchStoredToken } from '../auth/guards/match-token.guard.gql';
import { SubscriptionNames } from '../constants';
import { UserGraphQLType } from '../user/user.gql.type';
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
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  fetchMyGroups(
    @GqlGetUser() user: User,
    @Args({ name: 'fetchingOptions', type: () => FetchMyGroupsDto }, ValidationPipe)
    fetchMyGroupsDto: FetchMyGroupsDto,
  ): Promise<Group[]> {
    return this.groupService.fetchMyGroups(user, fetchMyGroupsDto);
  }

  @ResolveField(returns => [UserGraphQLType], { name: 'members' })
  async members(@Parent() group: Group): Promise<User[]> {
    return this.groupService.fetchGroupMembers(group);
  }

  @Mutation(returns => GroupGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  createGroup(
    @GqlGetUser() user: User,
    @Args({ name: 'createGroupInput', type: () => CreateGroupDto }, ValidationPipe)
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return this.groupService.createGroup(user, createGroupDto);
  }

  @Subscription(returns => GroupGraphQLType, {
    name: SubscriptionNames.onChangeGroup,
    /** To filter out specific events */
    async filter(this: GroupResolver, payloadGroup: Group, variables) {
      /** variables is the args that inputed into the Subscription */
      return payloadGroup.uuid === variables.uuid;
    },
    /** Mutating subscription payloads */
    resolve(this: GroupResolver, value) {
      /** "this" refers to an instance of "GroupResolver" */
      return value.onChangeGroup;
    },
  })
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  onChangeGroups(@GqlGetUser() user: User): Promise<Group> {
    return;
  }
}
