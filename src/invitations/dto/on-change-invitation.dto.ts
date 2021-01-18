import { Invitation } from '../invitation.entity';

export interface OnChangeInvitationDto {
  type: 'insert' | 'response';
  invitation: Invitation;
}
