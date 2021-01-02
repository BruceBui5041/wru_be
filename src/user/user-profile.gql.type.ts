import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('UserProfile')
export class UserProfileGraphQLType {
  @Field()
  phoneNumber: string;

  @Field()
  avatarUrl: string;

  @Field()
  status: string;

  @Field()
  placesWantToGoTo: string;
}
