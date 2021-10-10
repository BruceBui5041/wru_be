import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionNames } from 'src/constants';
import { JouneyRepository } from 'src/jouney/jouney.repository';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { SharedJouneySubcriptionDto } from './dto/shared-jouney-subscription.dto';
import { SharedJouney } from './shared-jouney.entity';
import { SharedJouneyRepository } from './shared-jouney.repository';

@Injectable()
export class SharedJouneyService {
  constructor(
    @InjectRepository(JouneyRepository)
    private readonly jouneyRepository: JouneyRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(SharedJouneyRepository)
    private readonly sharedJouneyRepository: SharedJouneyRepository,
  ) {}

  async shareJouney(
    jouneyId: string,
    owner: User,
    userSharedName: string,
    pubSub: PubSub,
  ): Promise<SharedJouney> {
    try {
      let jouney = await this.jouneyRepository.findOne(jouneyId);
      if (!jouney) throw new NotFoundException('Jouney not found');

      if (jouney.owner.uuid !== owner.uuid)
        throw new UnauthorizedException('You are not the owner of this jouney');

      const userShared = await this.userRepository.findOne({
        where: { username: userSharedName },
      });
      if (!userShared) throw new NotFoundException('User shared is not found');

      const sharedJouney = await this.sharedJouneyRepository.createSharedJouney(
        jouney,
        owner,
        userShared,
      );

      if (!sharedJouney.uuid)
        throw new NotAcceptableException(
          'You already shared this jouney to this user',
        );

      const subcriptionResponse = new SharedJouneySubcriptionDto(
        'insert',
        sharedJouney,
      );

      pubSub?.publish(
        SubscriptionNames.onChangedSharedJouney,
        subcriptionResponse,
      );

      return sharedJouney;
    } catch (err) {
      throw err;
    }
  }
}
