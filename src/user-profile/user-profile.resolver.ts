import { Resolver } from '@nestjs/graphql';
import { UserGraphQLType } from 'src/user/user.gql.type';

@Resolver(type => UserGraphQLType)
export class UserProfileResolver {}
