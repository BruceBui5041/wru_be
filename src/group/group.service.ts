import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './group.entity';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
  ) {}

  async createGroup(creater: User, createGroupDto: CreateGroupDto): Promise<Group> {
    const newGroup = await this.groupRepository.createGroup(creater, createGroupDto);
    return newGroup;
  }
}
