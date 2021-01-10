import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('UserProfile')
export class UserProfileGraphQLType {
  @Field({ defaultValue: '', nullable: true })
  phoneNumber: string;

  @Field({ defaultValue: '', nullable: true })
  avatarUrl: string;

  @Field({ defaultValue: '', nullable: true })
  status: string;

  @Field({ defaultValue: '', nullable: true })
  placesWantToGoTo: string;
}
