import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GetJwtToken } from './decorators/get-token.decorator';
import { GqlAuthGuard } from './guards/auth.guard.gql';
import { UserGraphQLType } from './user.gql.type';

@Resolver(type => UserGraphQLType)
export class UserResolver {
  constructor(private authService: AuthService) {}

  @Query(returns => UserGraphQLType)
  @UseGuards(GqlAuthGuard)
  async getUserInfo(@GetJwtToken() token: string): Promise<UserGraphQLType> {
    const { uuid } = await this.authService.parseTokenToInfomation(token);
    return await this.authService.getUserInfoByUUID(uuid);
  }
}
