import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './group.entity';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { FetchMyGroupsDto } from './dto/fetch-my-groups.dto';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }
  async createGroup(creater: User, createGroupDto: CreateGroupDto): Promise<Group> {
    const { groupName, groupImageUrl, description } = createGroupDto;
    const group = new Group(creater);

    group.groupName = groupName;
    group.groupImageUrl = groupImageUrl;
    group.description = description;

    try {
      return group.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async fetchMyGroups(user: User, fetchMyGroupsDto: FetchMyGroupsDto): Promise<Group[]> {
    const groups = await this.find({ owner: user });

    // const groups = await this.createQueryBuilder(Group.name)
    //   .leftJoinAndSelect(`${Group.name}.ownerUuid`, 'owner')
    //   .where(`${Group.name}.ownerUuid =:userUuid`, { userUuid: user.uuid })
    //   .getMany();
    return groups;
  }

  async addMember(newMemberUsernameOrEmail: string, groupUuid: string): Promise<Group> {
    try {
      const newMember = await this.userRepository
        .createQueryBuilder(User.name)
        .where('user.username = :username OR user.email = :email', {
          username: newMemberUsernameOrEmail,
          email: newMemberUsernameOrEmail,
        })
        .getOne();
      if (!newMember) throw new NotFoundException('Invited user is not found');

      const group = await this.findOne(groupUuid);
      if (!group) throw new NotFoundException('This group is not found');

      const res = await this.update(group, { members: [...group.members, newMember] });
      if (res.affected > 0) return await this.findOne(groupUuid);
      throw new InternalServerErrorException('Can not add new member');
    } catch (err) {
      throw err;
    }
  }
}
