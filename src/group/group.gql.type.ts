import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLType } from '../user/user.gql.type';
import { JouneyGraphQLType } from '../jouney/jouney.gql.type';

@ObjectType('Group')
export class GroupGraphQLType {
  @Field()
  uuid: string;

  @Field()
  groupName: string;

  @Field({ nullable: true })
  groupImageUrl: string;

  @Field()
  owner: UserGraphQLType;

  @Field(type => [UserGraphQLType], { defaultValue: [], nullable: true })
  members: UserGraphQLType[];

  @Field(type => [JouneyGraphQLType], { defaultValue: [], nullable: true })
  jouneys: JouneyGraphQLType[];
}
