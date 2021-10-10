import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PubSubProvider } from 'src/constants';
import { Jouney } from 'src/jouney/jouney.entity';
import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { SharedJouney } from './shared-jouney.entity';

@EntityRepository(SharedJouney)
export class SharedJouneyRepository extends Repository<SharedJouney> {
  async createSharedJouney(jouney: Jouney, owner: User, sharedUser: User) {
    try {
      const newSharedJouney: SharedJouney = new SharedJouney(
        jouney,
        owner,
        sharedUser,
      );

      return await this.save(newSharedJouney);
    } catch (err) {
      throw err;
    }
  }
}
