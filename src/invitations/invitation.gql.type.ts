import { Field, ObjectType, Scalar } from '@nestjs/graphql';
import { Group } from '../group/group.entity';
import { GroupGraphQLType } from '../group/group.gql.type';
import { User } from '../user/user.entity';
import { UserGraphQLType } from '../user/user.gql.type';
import { InvitationStatus } from './invitation.entity';

@ObjectType('Invitation')
export class InvitationGraphQLType {
  @Field()
  uuid: string;

  @Field(() => UserGraphQLType)
  owner: User;

  @Field(() => UserGraphQLType)
  invitedUser: User;

  @Field(() => GroupGraphQLType)
  group: Group;

  @Field()
  status: InvitationStatus;

  @Field(type => Date)
  createdAt: Date;
}
