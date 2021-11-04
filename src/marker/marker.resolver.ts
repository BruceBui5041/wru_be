import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GqlGetUser } from 'src/auth/decorators/get-user.gql.decorator';
import { GqlAuthGuard } from 'src/auth/guards/auth.guard.gql';
import { GqlMatchStoredTokenGuard } from 'src/auth/guards/match-token.guard.gql';
import { User } from 'src/user/user.entity';
import { InputMarkerDto } from './dto/input-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { Marker } from './marker.entity';
import { MarkerGraphQLType } from './marker.gql.type';
import { MarkerService } from './marker.service';

@Resolver()
export class MarkerResolver {
  constructor(private readonly markerService: MarkerService) {}

  @Query((returns) => [MarkerGraphQLType])
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  markers(
    @Args({ name: 'jouneyId', type: () => String! }) jouneyId: string,
  ): Promise<Marker[]> {
    return this.markerService.fetchAllMarkerByJouneyId(jouneyId);
  }

  @Mutation((returns) => MarkerGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  createMarker(
    @GqlGetUser() user: User,
    @Args({ name: 'jouneyId', type: () => String! }) jouneyId: string,
    @Args({ name: 'marker', type: () => InputMarkerDto }, ValidationPipe)
    createMarkerDto: InputMarkerDto,
  ): Promise<Marker> {
    return this.markerService.create(user, jouneyId, createMarkerDto);
  }

  @Mutation((returns) => MarkerGraphQLType)
  @UseGuards(GqlAuthGuard, GqlMatchStoredTokenGuard)
  updateMarker(
    @Args({ name: 'id', type: () => String! })
    id: string,
    @Args({ name: 'marker', type: () => UpdateMarkerDto }, ValidationPipe)
    markerInfo: UpdateMarkerDto,
  ): Promise<Marker> {
    return this.markerService.update(id, markerInfo);
  }
}
