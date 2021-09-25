import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { GqlGetUser } from 'src/auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from 'src/auth/guards/auth.guard.gql';
import { GqlMatchStoredToken } from 'src/auth/guards/match-token.guard.gql';
import { User } from 'src/user/user.entity';
import { Jouney } from './jouney.entity';
import { JouneyService } from './jouney.service';
import { InputJouneyDto } from './dto/input-jouney.dto';
import { JouneyGraphQLType } from './jouney.gql.type';
import { UpdateJouneyDto } from './dto/update-jouney.dto';
@Resolver()
export class JouneyResolver {
  constructor(private readonly jouneyService: JouneyService, private readonly authService: AuthService) {}

  @Query(returns => [JouneyGraphQLType])
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  fetchAllMyJouney(@GqlGetUser() user: User): Promise<Jouney[]> {
    return this.jouneyService.fetchAllMyJouney(user);
  }

  @Mutation(returns => JouneyGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  createJouney(
    @GqlGetUser() user: User,
    @Args({ name: 'jouney', type: () => InputJouneyDto }, ValidationPipe)
    createJouneyDto: InputJouneyDto,
  ): Promise<Jouney> {
    return this.jouneyService.create(user, createJouneyDto);
  }

  @Mutation(returns => JouneyGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  updateJouney(
    @Args({ name: 'id', type: () => String! })
    id: string,
    @Args({ name: 'jouney', type: () => UpdateJouneyDto }, ValidationPipe)
    jouneyInfo: UpdateJouneyDto,
  ): Promise<Jouney> {
    return this.jouneyService.update(id, jouneyInfo);
  }
}
