import { EntityRepository, Repository } from 'typeorm';
import { Invitation } from './invitation.entity';
import { User } from '../user/user.entity';
import { Group } from '../group/group.entity';

@EntityRepository(Invitation)
export class InvitationRepository extends Repository<Invitation> {
  async createInvitation(owner: User, invitedUser: User, group: Group): Promise<Invitation> {
    try {
      const invitation = new Invitation(owner, invitedUser, group);
      return await invitation.save();
    } catch (err) {
      throw err;
    }
  }

  async getMyInvitations(userUuid: string, groupUuid?: string) {
    const invitations = this.find();
  }
}
