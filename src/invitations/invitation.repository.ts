import { EntityRepository, Repository } from 'typeorm';
import { Invitation, InvitationStatus } from './invitation.entity';
import { User } from '../user/user.entity';
import { Group } from '../group/group.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Invitation)
export class InvitationRepository extends Repository<Invitation> {
  createInvitation(owner: User, invitedUser: User, group: Group): Promise<Invitation> {
    try {
      const invitation = new Invitation(owner, invitedUser, group);
      return invitation.save();
    } catch (err) {
      throw err;
    }
  }

  async updateInvitationStatus(invitation: Invitation, newStatus: InvitationStatus): Promise<Invitation> {
    try {
      const res = await this.update(invitation.uuid, { status: newStatus });
      if (res.affected > 0) {
        return this.findOne(invitation.uuid);
      }
      throw new InternalServerErrorException('Accept failed. Please try again');
    } catch (err) {
      throw err;
    }
  }

  fetchMyInvitations(user: User): Promise<Invitation[]> {
    const invitations = this.find({ owner: user });
    return invitations;
  }
}
