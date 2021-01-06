import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class getMyInvitationsDto {
  @Field()
  @IsUUID()
  groupUuid: string;
}
