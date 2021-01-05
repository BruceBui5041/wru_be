import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateInvitationDto {
  @Field()
  @IsString()
  @MinLength(1)
  usernameOrEmail: string;

  @Field()
  @IsUUID()
  groupUuid: string;
}
