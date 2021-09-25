import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { FetchMyGroupsDto } from './dto/fetch-my-groups.dto';
import { Group } from './group.entity';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
  ) {}

  createGroup(creater: User, createGroupDto: CreateGroupDto): Promise<Group> {
    const newGroup = this.groupRepository.createGroup(creater, createGroupDto);
    return newGroup;
  }

  async fetchMyGroups(user: User, fetchMyGroupsDto: FetchMyGroupsDto): Promise<Group[]> {
    if (fetchMyGroupsDto.ids?.length > 0 && fetchMyGroupsDto.own) {
      return await this.groupRepository.findByIds(fetchMyGroupsDto.ids, { owner: user });
    }

    if (fetchMyGroupsDto.own) {
      return await this.groupRepository.find({ owner: user });
    }

    if (fetchMyGroupsDto.ids?.length > 0) {
      return await this.groupRepository.findByIds(fetchMyGroupsDto.ids);
    }

    const groups = await this.groupRepository
      .createQueryBuilder(Group.name)
      .leftJoinAndSelect(`${Group.name}.members`, 'member')
      .leftJoinAndSelect(`${Group.name}.owner`, 'owner')
      // .where(`owner.uuid =:userUuid`, { userUuid: user.uuid })
      .where(':userUuid = member.uuid', { userUuid: user.uuid })
      .getMany();

    return groups;
  }

  async fetchGroupMembers(group: Group): Promise<User[]> {
    const groupWithMembers = await this.groupRepository.findOne(
      { uuid: group.uuid },
      { relations: ['members'] },
    );
    return groupWithMembers.members;
  }
}
