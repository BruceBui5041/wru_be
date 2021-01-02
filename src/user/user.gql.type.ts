import { Field, ObjectType } from '@nestjs/graphql';
import { UserProfile } from './user-profile.entity';
import { UserProfileGraphQLType } from './user-profile.gql.type';

@ObjectType('User')
export class UserGraphQLType {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field({ nullable: true })
  email: string;

  @Field(() => UserProfileGraphQLType, { nullable: true })
  profile: UserProfile;
}
