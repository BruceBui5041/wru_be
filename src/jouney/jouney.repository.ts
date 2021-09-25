import { User } from 'src/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Jouney } from './jouney.entity';

@EntityRepository(Jouney)
export class JouneyRepositiory extends Repository<Jouney> {
  async createJouney(jouney: Jouney): Promise<Jouney> {
    try {
      return await this.save(jouney);
    } catch (err) {
      throw err;
    }
  }
}
