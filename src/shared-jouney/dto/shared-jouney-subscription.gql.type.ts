import { SharedJouney } from '../shared-jouney.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { SharedJouneyGraphQLType } from '../shared-jouney.gql.type';

type EventType = 'insert' | 'change' | 'delete';

@ObjectType()
export class SharedJouneySubcriptionGraphQLType {
  @Field()
  event: EventType;

  @Field()
  data: SharedJouneyGraphQLType;
}
