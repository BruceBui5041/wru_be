import {
  ConflictException,
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
import { Group } from 'src/group/group.entity';
import { Connection } from 'typeorm';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationRepository)
    private invitationRepository: InvitationRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
    private connection: Connection,
  ) {}

  async createInvitation(owner: User, createInvitationDto: CreateInvitationDto): Promise<Invitation> {
    const { usernameOrEmail, groupUuid } = createInvitationDto;
    try {
      const invitedUser = await this.userRepository.findOne({
        where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
      if (!invitedUser) throw new NotFoundException('Invited user is not found');

      const group = await this.groupRepository.findOne(groupUuid);
      if (!group) throw new NotFoundException('This group is not found');

      if ((group.members || []).find(member => member.uuid === invitedUser.uuid))
        throw new ConflictException(`${invitedUser.username} already is a member of this group`);

      const alreadyInvitedUser = this.invitationRepository.findOne({ invitedUser });
      if (alreadyInvitedUser) throw new ConflictException(`Already invited ${invitedUser.username}`);

      return this.invitationRepository.createInvitation(owner, invitedUser, group);
    } catch (err) {
      throw err;
    }
  }

  async acceptInvitation(user: User, acceptInvitationDto: AcceptInvitationDto): Promise<Invitation> {
    try {
      const { invitationUuid } = acceptInvitationDto;
      const invitation = await this.invitationRepository.findOne({ uuid: invitationUuid });

      if (!invitation) throw new NotFoundException('Invitation was not found');

      if (invitation.status != InvitationStatus.IGNORED && invitation.status != InvitationStatus.PENDING)
        throw new NotFoundException('This invitation is not pending anymore');

      if (invitation.invitedUser.uuid != user.uuid)
        throw new NotFoundException('Only invited user can accept an invitation');

      const group = await this.groupRepository.findOne(invitation.group.uuid);
      if (!group) throw new NotFoundException('Group was not found');

      await this.acceptInvitationTransaction(invitation, group, InvitationStatus.ACCEPTED);
      return this.invitationRepository.findOne({ uuid: invitation.uuid });
    } catch (err) {
      throw err;
    }
  }

  async acceptInvitationTransaction(
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

  fetchMyInvitations(user: User): Promise<Invitation[]> {
    return this.invitationRepository.fetchMyInvitations(user);
  }
}
