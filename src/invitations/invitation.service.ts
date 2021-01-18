import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '../group/group.repository';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Invitation, InvitationStatus } from './invitation.entity';
import { InvitationRepository } from './invitation.repository';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { Group } from '../group/group.entity';
import { Connection } from 'typeorm';
import { FetchInvitationDto } from './dto/fetch-my-invitations.dto';
import { PubSub } from 'graphql-subscriptions';
import { PubSubProvider } from '../constants';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationRepository)
    private invitationRepository: InvitationRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
    @Inject(PubSubProvider)
    private pubSub: PubSub,
    private connection: Connection,
  ) {}

  async createInvitation(owner: User, createInvitationDto: CreateInvitationDto): Promise<Invitation> {
    const { usernameOrEmail, groupUuid } = createInvitationDto;
    try {
      const invitedUser = await this.userRepository.findOne({
        where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
      if (!invitedUser) throw new NotFoundException('Invited user is not found');

      const group = await this.groupRepository.findOne({ uuid: groupUuid }, { relations: ['members'] });
      if (!group) throw new NotFoundException('This group is not found');

      if ((group.members || []).find(member => member.uuid === invitedUser.uuid))
        throw new ConflictException(`${invitedUser.username} already is a member of this group`);

      const alreadyInvitedUser = await this.invitationRepository.findOne({ uuid: invitedUser.uuid });

      if (
        alreadyInvitedUser &&
        [InvitationStatus.DENIED, InvitationStatus.IGNORED, InvitationStatus.PENDING].includes(
          alreadyInvitedUser.status,
        )
      )
        throw new ConflictException(`Already invited ${invitedUser.username}`);
      const result = await this.invitationRepository.createInvitation(owner, invitedUser, group);
      // this.pubSub.publish('onChangeInvitations', { invitation: result });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async responseInvitation(user: User, acceptInvitationDto: AcceptInvitationDto): Promise<Invitation> {
    const { invitationUuid, status } = acceptInvitationDto;

    const invitation = await this.invitationRepository.findOne({ uuid: invitationUuid });
    if (!invitation) throw new NotFoundException('Invitation was not found');

    const group = await this.groupRepository.findOne(invitation.group.uuid);
    if (!group) throw new NotFoundException('Group was not found');

    if (status == InvitationStatus.DESTROYED) {
      return this.destroyInvitation(user, invitation);
    }

    if (invitation.status == InvitationStatus.DESTROYED)
      throw new NotFoundException('Invitation had been disabled');

    switch (status) {
      case InvitationStatus.ACCEPTED:
        return this.acceptInvitation(user, invitation, group);
      case InvitationStatus.DENIED:
        return this.deniOrIgnoreInvivation(user, invitation, InvitationStatus.DENIED);
      case InvitationStatus.IGNORED:
        return this.deniOrIgnoreInvivation(user, invitation, InvitationStatus.IGNORED);
    }
  }

  private async destroyInvitation(user: User, invitation: Invitation) {
    try {
      if (invitation.status == InvitationStatus.ACCEPTED)
        throw new NotFoundException('Inviter is already accept this invitation');

      if (invitation.owner.uuid != user.uuid)
        throw new NotFoundException('Only owner can destroy an invitation');

      await this.invitationRepository.updateInvitationStatus(invitation, InvitationStatus.DESTROYED);
      return this.invitationRepository.findOne({ uuid: invitation.uuid });
    } catch (err) {
      throw err;
    }
  }

  private async acceptInvitation(user: User, invitation: Invitation, group: Group): Promise<Invitation> {
    try {
      if (invitation.status != InvitationStatus.IGNORED && invitation.status != InvitationStatus.PENDING)
        throw new NotFoundException('This invitation is not pending anymore');

      if (invitation.invitedUser.uuid != user.uuid)
        throw new NotFoundException('Only invited user can accept an invitation');

      await this.acceptInvitationTransaction(invitation, group, InvitationStatus.ACCEPTED);
      return this.invitationRepository.findOne({ uuid: invitation.uuid });
    } catch (err) {
      throw err;
    }
  }

  private async deniOrIgnoreInvivation(
    user: User,
    invitation: Invitation,
    status: InvitationStatus,
  ): Promise<Invitation> {
    try {
      if (invitation.status != InvitationStatus.PENDING)
        throw new NotFoundException('This invitation is not pending anymore');

      if (invitation.invitedUser.uuid != user.uuid)
        throw new NotFoundException(
          status == InvitationStatus.DENIED
            ? 'Only invited user can deni an invitation'
            : 'Only invited user can ignore an invitation',
        );

      await this.invitationRepository.updateInvitationStatus(invitation, status);
      return this.invitationRepository.findOne({ uuid: invitation.uuid });
    } catch (err) {
      throw err;
    }
  }

  private async acceptInvitationTransaction(
    invitation: Invitation,
    group: Group,
    invitationStatus: InvitationStatus,
  ) {
    try {
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager
          .getRepository(Invitation)
          .update({ uuid: invitation.uuid }, { status: invitationStatus });

        // group.members.push(invitation.invitedUser);

        // TODO: Update with many-to-many relation is wrong here. Need to update later

        // await queryRunner.manager
        //   .getRepository(Group)
        //   .update({ uuid: group.uuid }, { members: group.members });

        await queryRunner.manager.query(
          `INSERT \`group_user\` set \`groupUuid\` = '${group.uuid}' , \`userUuid\` = '${invitation.invitedUser.uuid}'`,
        );

        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        console.log(err);
        throw new InternalServerErrorException('Accept failed. Please try again');
      } finally {
        await queryRunner.release();
      }
    } catch (err) {
      throw err;
    }
  }

  fetchMyInvitations(user: User, fetchInvitationDto: FetchInvitationDto): Promise<Invitation[]> {
    if (fetchInvitationDto.own) {
      return this.invitationRepository.find({ owner: user });
    }
    return this.invitationRepository.find({ invitedUser: user });
  }
}
