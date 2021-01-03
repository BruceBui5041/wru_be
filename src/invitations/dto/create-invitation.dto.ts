import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateInvitationDto {
  @Field()
  @IsString()
  usernameOrEmail: string;

  @Field()
  @IsUUID()
  groupUuid: string;
}
