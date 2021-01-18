import { Inject, UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { GqlGetUser } from '../auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from '../auth/guards/auth.guard.gql';
import { User } from '../user/user.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { Invitation } from './invitation.entity';
import { InvitationGraphQLType } from './dto/invitation.gql.type';
import { InvitationService } from './invitation.service';
import { GqlMatchStoredToken } from '../auth/guards/match-token.guard.gql';
import { FetchInvitationDto } from './dto/fetch-my-invitations.dto';
import { PubSub } from 'graphql-subscriptions';
import { PubSubProvider, SubscriptionNames } from '../constants';
import { OnChangeInvitationDto } from './dto/on-change-invitation.dto';
import { SubscriptionInvitationGraphQLType } from './dto/subscription-invitation.gql.type';

@Resolver(() => InvitationGraphQLType)
export class InvitationResolver {
  constructor(
    private readonly invitationService: InvitationService,
    @Inject(PubSubProvider)
    private pubSub: PubSub,
  ) {}

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
  async responseToInvitation(
    @GqlGetUser() user: User,
    @Args({ name: 'acceptInput', type: () => AcceptInvitationDto }) acceptInvitationDto: AcceptInvitationDto,
  ): Promise<Invitation> {
    const result = await this.invitationService.responseInvitation(user, acceptInvitationDto);
    const changeInvitationDto: OnChangeInvitationDto = { type: 'response', invitation: result };
    this.pubSub.publish(SubscriptionNames.onChangeInvitations, changeInvitationDto);
    return result;
  }

  @Mutation(returns => InvitationGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  async createInvitation(
    @GqlGetUser() user: User,
    @Args('createInvitationInput', ValidationPipe) createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation> {
    const result = await this.invitationService.createInvitation(user, createInvitationDto);
    const changeInvitationDto: OnChangeInvitationDto = { type: 'insert', invitation: result };
    this.pubSub.publish(SubscriptionNames.onChangeInvitations, changeInvitationDto);
    return result;
  }

  @Subscription(returns => SubscriptionInvitationGraphQLType, {
    name: SubscriptionNames.onChangeInvitations,
    async filter(this: InvitationResolver, payload: OnChangeInvitationDto, variables) {
      const invitation = payload.invitation;
      return [invitation.invitedUser.username, invitation.owner.username].includes(variables.username);
    },
    resolve(this: InvitationResolver, value: OnChangeInvitationDto) {
      return value;
    },
  })
  onChangeInvitations(@Args({ name: 'username' }) username: string) {
    return this.pubSub.asyncIterator([SubscriptionNames.onChangeInvitations]);
  }
}
