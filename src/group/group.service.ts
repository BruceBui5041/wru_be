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

  fetchMyGroups(user: User, fetchMyGroupsDto: FetchMyGroupsDto): Promise<Group[]> {
    return this.groupRepository.fetchMyGroups(user, fetchMyGroupsDto);
  }
}
