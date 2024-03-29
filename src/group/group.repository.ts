import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './group.entity';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

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
      await group.save();

      // Update many to many manually
      await this.query(
        `INSERT \`${Group.joinUserTable.tableName}\` set \`${Group.joinUserTable.groupUuid}\` = '${group.uuid}' , \`${Group.joinUserTable.userUuid}\` = '${creater.uuid}'`,
      );
      return group;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
