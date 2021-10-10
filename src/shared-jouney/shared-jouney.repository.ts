import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PubSubProvider } from 'src/constants';
import { Jouney } from 'src/jouney/jouney.entity';
import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { SharedJouney } from './shared-jouney.entity';

@EntityRepository(SharedJouney)
export class SharedJouneyRepository extends Repository<SharedJouney> {
  async selectSharedJouney(sharedUser: User): Promise<SharedJouney[]> {
    try {
      return await this.find({
        where: { sharedUser: { uuid: sharedUser.uuid } },
      });
    } catch (err) {
      throw err;
    }
  }

  async selectMySharedJouney(user: User): Promise<SharedJouney[]> {
    try {
      return await this.find({
        where: { jouneyOwner: { uuid: user.uuid } },
      });
    } catch (err) {
      throw err;
    }
  }

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
