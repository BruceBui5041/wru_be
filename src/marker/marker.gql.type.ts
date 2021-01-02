import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLType } from '../user/user.gql.type';
import { JouneyGraphQLType } from '../jouney/jouney.gql.type';

@ObjectType('Marker')
export class MarkerGraphQLType {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field({ defaultValue: 'public' })
  visibility: string;

  @Field()
  owner: UserGraphQLType;

  @Field(type => JouneyGraphQLType)
  jouney: JouneyGraphQLType;
}
