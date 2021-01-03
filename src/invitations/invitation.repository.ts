import { UserRepository } from '../user/user.repository';
import { EntityRepository, Repository } from 'typeorm';
import { Invitation } from './invitation.entity';
import { CreateInvitationDto } from '../invitations/dto/create-invitation.dto';
import { User } from 'src/user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { GroupRepository } from 'src/group/group.repository';

@EntityRepository(Invitation)
export class InvitationRepository extends Repository<Invitation> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {
    super();
  }

  async createInvitation(owner: User, createInvitationDto: CreateInvitationDto): Promise<Invitation> {
    const { usernameOrEmail, groupUuid } = createInvitationDto;
    try {
      const invitedUser = await this.userRepository
        .createQueryBuilder(User.name)
        .where('user.username = :username OR user.email = :email', {
          username: usernameOrEmail,
          email: usernameOrEmail,
        })
        .getOne();
      if (!invitedUser) throw new NotFoundException('Invited user is not found');

      const group = await this.groupRepository.findOne(groupUuid);
      if (!group) throw new NotFoundException('This group is not found');

      const invitation = new Invitation(owner, invitedUser, group);
      return await invitation.save();
    } catch (err) {
      throw err;
    }
  }
}
