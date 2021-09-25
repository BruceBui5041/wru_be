import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLType } from '../user/user.gql.type';
import { GroupGraphQLType } from '../group/group.gql.type';

@ObjectType('Jouney')
export class JouneyGraphQLType {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  visibility: string;

  @Field()
  owner?: UserGraphQLType;
}
