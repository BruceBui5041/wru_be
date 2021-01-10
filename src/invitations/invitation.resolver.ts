import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGetUser } from '../auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from '../auth/guards/auth.guard.gql';
import { User } from '../user/user.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { Invitation } from './invitation.entity';
import { InvitationGraphQLType } from './invitation.gql.type';
import { InvitationService } from './invitation.service';
import { GqlMatchStoredToken } from 'src/auth/guards/match-token.guard.gql';
import { FetchInvitationDto } from './dto/fetch-my-invitations.dto';

@Resolver(() => InvitationGraphQLType)
export class InvitationResolver {
  constructor(private readonly invitationService: InvitationService) {}

  @Query(returns => [InvitationGraphQLType])
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  fetchMyInvitations(
    @GqlGetUser() user: User,
    @Args({ name: 'fetchOptions', type: () => FetchInvitationDto })
    fetchInvitationDto: FetchInvitationDto,
  ): Promise<Invitation[]> {
    return this.invitationService.fetchMyInvitations(user, fetchInvitationDto);
  }

  @Mutation(returns => InvitationGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  acceptInvitation(
    @GqlGetUser() user: User,
    @Args({ name: 'acceptInput', type: () => AcceptInvitationDto }) acceptInvitationDto: AcceptInvitationDto,
  ): Promise<Invitation> {
    return this.invitationService.responseInvitation(user, acceptInvitationDto);
  }

  @Mutation(returns => InvitationGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  createInvitation(
    @GqlGetUser() user: User,
    @Args('createInvitationInput', ValidationPipe) createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation> {
    return this.invitationService.createInvitation(user, createInvitationDto);
  }
}
