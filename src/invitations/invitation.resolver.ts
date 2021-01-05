import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUserGQL } from '../auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from '../auth/guards/auth.guard.gql';
import { User } from '../user/user.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Invitation } from './invitation.entity';
import { InvitationGraphQLType } from './invitation.gql.type';
import { InvitationService } from './invitation.service';

@Resolver(() => InvitationGraphQLType)
export class InvitationResolver {
  constructor(private readonly invitationService: InvitationService) {}

  @Query(() => [InvitationGraphQLType])
  @UseGuards(GqlAuthGuard)
  getMyInvitations() {}

  @Mutation(() => InvitationGraphQLType)
  @UseGuards(GqlAuthGuard)
  createInvitation(
    @GetUserGQL() user: User,
    @Args('createInvitationInput', ValidationPipe) createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation> {
    return this.invitationService.createInvitation(user, createInvitationDto);
  }
}
