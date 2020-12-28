import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UserGraphQLType {
  @Field()
  id: number;

  @Field()
  username: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field({ nullable: true })
  imageUrl: string;
}
