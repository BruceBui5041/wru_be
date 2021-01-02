import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './group.entity';
import { User } from '../user/user.entity';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
  async createGroup(creater: User, createGroupDto: CreateGroupDto): Promise<Group> {
    const { groupName, groupImageUrl, description } = createGroupDto;
    const group = new Group(creater);

    group.groupName = groupName;
    group.groupImageUrl = groupImageUrl;
    group.description = description;

    try {
      return await group.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
