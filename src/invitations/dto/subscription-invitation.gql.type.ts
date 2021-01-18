import { Field, ObjectType } from '@nestjs/graphql';
import { InvitationGraphQLType } from './invitation.gql.type';

@ObjectType('SubscriptionInvitation')
export class SubscriptionInvitationGraphQLType {
  @Field()
  type: string;

  @Field()
  invitation: InvitationGraphQLType;
}
