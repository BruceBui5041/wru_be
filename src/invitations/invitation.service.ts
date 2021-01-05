import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupRepository } from '../group/group.repository';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Invitation } from './invitation.entity';
import { InvitationRepository } from './invitation.repository';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(InvitationRepository)
    private readonly invitationRepository: InvitationRepository,
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

      return await this.invitationRepository.createInvitation(owner, invitedUser, group);
    } catch (err) {
      throw err;
    }
  }
}
