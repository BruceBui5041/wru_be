import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FetchMyGroupsDto {
  @Field({ nullable: true, defaultValue: true })
  own: boolean = true;
}
