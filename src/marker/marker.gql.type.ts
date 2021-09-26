import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQLType } from '../user/user.gql.type';
import { JouneyGraphQLType } from '../jouney/jouney.gql.type';
import { MarkerVisibility } from './marker.enum';

@ObjectType('Marker')
export class MarkerGraphQLType {
  @Field()
  uuid: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  lat: number;

  @Field()
  lng: number;

  @Field()
  visibility: MarkerVisibility;

  @Field(type => UserGraphQLType)
  owner: UserGraphQLType;

  @Field(type => JouneyGraphQLType)
  jouney: JouneyGraphQLType;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  image1?: string;

  @Field({ nullable: true })
  image2: string;

  @Field({ nullable: true })
  image3?: string;

  @Field({ nullable: true })
  image4?: string;

  @Field({ nullable: true })
  image5?: string;
}
