import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsIn, IsUUID } from 'class-validator';
import { InvitationStatus } from '../invitation.entity';

registerEnumType(InvitationStatus, {
  name: 'InvitationStatus',
  description: 'Determine the status of an invitation',
});

@InputType()
export class AcceptInvitationDto {
  @Field()
  @IsUUID()
  invitationUuid: string;

  @Field(type => InvitationStatus)
  @IsIn(Object.values(InvitationStatus))
  status: InvitationStatus;
}
