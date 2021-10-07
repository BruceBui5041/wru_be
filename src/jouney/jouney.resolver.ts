import {
  CacheKey,
  CacheTTL,
  NotFoundException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
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
import { JouneyRepository } from './jouney.repository';
import { MarkerGraphQLType } from 'src/marker/marker.gql.type';
import { MarkerService } from 'src/marker/marker.service';
import { Marker } from 'src/marker/marker.entity';
@Resolver((returns) => JouneyGraphQLType)
export class JouneyResolver {
  constructor(
    private readonly jouneyService: JouneyService,
    private readonly jouneyRepository: JouneyRepository,
    private readonly markerService: MarkerService,
  ) {}

  @Query((returns) => JouneyGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  async jouney(
    @Args({ name: 'id', type: () => String! }) id: String,
  ): Promise<Jouney> {
    const jouney = await this.jouneyRepository.findOne({ where: { uuid: id } });
    if (!jouney) throw new NotFoundException('Not found the record');
    return jouney;
  }

  @Query((returns) => [JouneyGraphQLType])
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  jouneys(@GqlGetUser() user: User): Promise<Jouney[]> {
    return this.jouneyService.fetchAllMyJouney(user);
  }

  @ResolveField((returns) => Number)
  markerCount(@Parent() jouney: Jouney): Promise<number> {
    return this.jouneyService.countMarker(jouney);
  }

  @ResolveField((returns) => [MarkerGraphQLType])
  markers(@Parent() jouney: Jouney): Promise<Marker[]> {
    return this.markerService.fetchAllMarkerByJouneyId(jouney.uuid);
  }

  @Mutation((returns) => JouneyGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredToken)
  createJouney(
    @GqlGetUser() user: User,
    @Args({ name: 'jouney', type: () => InputJouneyDto }, ValidationPipe)
    createJouneyDto: InputJouneyDto,
  ): Promise<Jouney> {
    return this.jouneyService.create(user, createJouneyDto);
  }

  @Mutation((returns) => JouneyGraphQLType)
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
