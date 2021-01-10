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
    if (fetchMyGroupsDto.own) {
      return await this.groupRepository.find({ owner: user });
    }

    const groups = await this.groupRepository
      .createQueryBuilder(Group.name)
      .leftJoinAndSelect(`${Group.name}.members`, 'member')
      .leftJoinAndSelect(`${Group.name}.owner`, 'owner')
      .where(`member.uuid =:userUuid`, { userUuid: user.uuid })
      .getMany();

    return groups;
  }
}
