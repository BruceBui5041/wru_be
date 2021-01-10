import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FetchInvitationDto {
  @Field({ nullable: true, defaultValue: true })
  own: boolean = true;
}
