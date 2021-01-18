import { Resolver } from '@nestjs/graphql';
import { UserGraphQLType } from '../user/user.gql.type';

@Resolver(type => UserGraphQLType)
export class UserProfileResolver {}
