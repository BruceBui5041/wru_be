import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLType } from '../user/user.gql.type';
import { GroupGraphQLType } from '../group/group.gql.type';
import { MarkerGraphQLType } from 'src/marker/marker.gql.type';
import { Marker } from 'src/marker/marker.entity';

@ObjectType('Jouney')
export class JouneyGraphQLType {
  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  visibility: string;

  @Field()
  owner?: UserGraphQLType;

  @Field(type => Date)
  createdAt: Date;

  @Field(type => Date)
  updatedAt: Date;

  @Field(type => Number)
  markerCount: number;

  @Field(type => [MarkerGraphQLType])
  markers: Marker[];
}
