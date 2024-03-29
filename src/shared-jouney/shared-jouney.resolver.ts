import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthService } from 'src/auth/auth.service';
import { GqlGetUser } from 'src/auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from 'src/auth/guards/auth.guard.gql';
import { GqlMatchStoredTokenGuard } from 'src/auth/guards/match-token.guard.gql';
import { PubSubProvider, SubscriptionNames } from 'src/constants';
import { User } from 'src/user/user.entity';
import { SharedJouneySubcriptionDto } from './dto/shared-jouney-subscription.dto';
import { SharedJouney } from './shared-jouney.entity';
import { SharedJouneyGraphQLType } from './shared-jouney.gql.type';
import { SharedJouneyService } from './shared-jouney.service';

@Resolver()
export class SharedJouneyResolver {
  constructor(
    private readonly sharedJouneyService: SharedJouneyService,
    private readonly authService: AuthService,
    @Inject(PubSubProvider)
    private pubSub: PubSub,
  ) {}

  @Query((returns) => [SharedJouneyGraphQLType])
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  fetchSharedJouney(
    @GqlGetUser() user: User,
    @Args({ name: 'owner', type: () => Boolean!, nullable: true })
    owner: boolean = false,
  ) {
    return this.sharedJouneyService.fetchSharedJouney(user, owner);
  }

  @Mutation((returns) => SharedJouneyGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  checkSharedJouney(
    @GqlGetUser() user: User,
    @Args({ name: 'sharedJouneyId', type: () => String! })
    id: string,
  ): Promise<SharedJouney> {
    return this.sharedJouneyService.checkSharedJouney(user, id, this.pubSub);
  }

  @Mutation((returns) => SharedJouneyGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  acceptSharedJouney(
    @GqlGetUser() user: User,
    @Args({ name: 'sharedJouneyId', type: () => String! })
    id: string,
  ): Promise<SharedJouney> {
    return this.sharedJouneyService.acceptSharedJouney(user, id, this.pubSub);
  }

  @Mutation((returns) => SharedJouneyGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  shareJouney(
    @GqlGetUser() user: User,
    @Args({ name: 'jouneyId', type: () => String! })
    id: string,
    @Args({ name: 'userSharedName', type: () => String! })
    userSharedName: string,
  ): Promise<SharedJouney> {
    return this.sharedJouneyService.shareJouney(
      id,
      user,
      userSharedName,
      this.pubSub,
    );
  }

  @Subscription((returns) => SharedJouneyGraphQLType, {
    name: SubscriptionNames.onChangedSharedJouney,
    /** To filter out specific events */
    async filter(
      this: SharedJouneyResolver,
      payload: SharedJouneySubcriptionDto,
      variables,
    ) {
      const { data, event } = payload;

      return (
        !this.authService.isTokenExpired(variables.userToken) &&
        data.sharedUser.token == variables.userToken &&
        variables.event == event
      );
    },
    /** Mutating subscription payloads */
    resolve(this, value: SharedJouneySubcriptionDto) {
      return value.data;
    },
  })
  onChangeSharedJouney(
    @Args({ name: 'userToken' }) userToken: string,
    @Args({ name: 'event' }) event: string,
  ) {
    return this.pubSub.asyncIterator(SubscriptionNames.onChangedSharedJouney);
  }
}
