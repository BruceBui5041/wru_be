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

@Resolver(() => InvitationGraphQLType)
export class InvitationResolver {
  constructor(private readonly invitationService: InvitationService) {}

  @Query(returns => [InvitationGraphQLType])
  @UseGuards(GqlAuthGuard)
  fetchMyInvitations(@GqlGetUser() user: User): Promise<Invitation[]> {
    return this.invitationService.fetchMyInvitations(user);
  }

  @Mutation(returns => InvitationGraphQLType)
  @UseGuards(GqlAuthGuard)
  acceptInvitation(
    @GqlGetUser() user: User,
    @Args({ name: 'acceptInput', type: () => AcceptInvitationDto }) acceptInvitationDto: AcceptInvitationDto,
  ): Promise<Invitation> {
    return this.invitationService.acceptInvitation(user, acceptInvitationDto);
  }

  @Mutation(returns => InvitationGraphQLType)
  @UseGuards(GqlAuthGuard)
  createInvitation(
    @GqlGetUser() user: User,
    @Args('createInvitationInput', ValidationPipe) createInvitationDto: CreateInvitationDto,
  ): Promise<Invitation> {
    return this.invitationService.createInvitation(user, createInvitationDto);
  }
}
