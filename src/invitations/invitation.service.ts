import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '../group/group.repository';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Invitation, InvitationStatus } from './invitation.entity';
import { InvitationRepository } from './invitation.repository';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationRepository)
    private invitationRepository: InvitationRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(GroupRepository)
    private readonly groupRepository: GroupRepository,
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

      return this.invitationRepository.updateInvitationStatus(invitation, InvitationStatus.ACCEPTED);
    } catch (err) {
      throw err;
    }
  }

  fetchMyInvitations(user: User): Promise<Invitation[]> {
    return this.invitationRepository.fetchMyInvitations(user);
  }
}
