import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLType } from '../user/user.gql.type';
import { GroupGraphQLType } from '../group/group.gql.type';

@ObjectType('Jouney')
export class JouneyGraphQLType {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field({ defaultValue: 'public' })
  visibility: string;

  @Field()
  owner: UserGraphQLType;

  @Field(type => GroupGraphQLType)
  group: GroupGraphQLType;
}
