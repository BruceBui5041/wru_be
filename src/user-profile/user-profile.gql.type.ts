import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('UserProfile')
export class UserProfileGraphQLType {
  @Field()
  uuid: string;

  @Field({ defaultValue: '', nullable: true })
  phoneNumber: string;

  @Field({ defaultValue: '', nullable: true })
  image: string;

  @Field({ defaultValue: '', nullable: true })
  status: string;

  @Field({ defaultValue: '', nullable: true })
  placesWantToGoTo: string;
}
