import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import { GetUserGQL } from '../auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from '../auth/guards/auth.guard.gql';
import { User } from '../user/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './group.entity';
import { GroupGraphQLType } from './group.gql.type';
import { GroupService } from './group.service';

@Resolver(type => GroupGraphQLType)
export class GroupResolver {
  constructor(private groupService: GroupService, private authService: AuthService) {}

  @Mutation(returns => GroupGraphQLType)
  @UseGuards(GqlAuthGuard)
  async createGroup(
    @GetUserGQL() user: User,
    @Args({ name: 'createGroupInput', type: () => CreateGroupDto }, ValidationPipe)
    createGroupDto: CreateGroupDto,
  ): Promise<Group> {
    return this.groupService.createGroup(user, createGroupDto);
  }
}
