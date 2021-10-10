import { Field, ObjectType } from '@nestjs/graphql';
import { JouneyGraphQLType } from 'src/jouney/jouney.gql.type';
import { UserGraphQLType } from 'src/user/user.gql.type';

@ObjectType()
export class SharedJouneyGraphQLType {
  @Field()
  uuid: string;

  @Field()
  jouney: JouneyGraphQLType;

  @Field()
  jouneyOwner: UserGraphQLType;

  @Field()
  sharedUser: UserGraphQLType;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;
}
