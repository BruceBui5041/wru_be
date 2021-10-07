import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Jouney } from './jouney.entity';
import { JouneyRepository } from './jouney.repository';
import { InputJouneyDto } from './dto/input-jouney.dto';
import { UpdateJouneyDto } from './dto/update-jouney.dto';
import { MarkerRepository } from 'src/marker/marker.repository';
import { Marker } from 'src/marker/marker.entity';

@Injectable()
export class JouneyService {
  constructor(
    @InjectRepository(JouneyRepository)
    private readonly jouneyRepository: JouneyRepository,
    @InjectRepository(MarkerRepository)
    private readonly markerRepository: MarkerRepository,
  ) {}

  async create(owner: User, inputJouneyDto: InputJouneyDto): Promise<Jouney> {
    try {
      const newJouney = new Jouney(owner, inputJouneyDto);
      return await this.jouneyRepository.createJouney(newJouney);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(jouneyId: string, jouneyInfo: UpdateJouneyDto): Promise<Jouney> {
    try {
      const { name, image, description, visibility } = jouneyInfo;
      const jouney = await this.jouneyRepository.findOne(jouneyId);

      if (!jouney) {
        throw new NotFoundException('Not found the record');
      }

      jouney.name = name;
      jouney.image = image;
      jouney.description = description;
      jouney.visibility = visibility;

      await this.jouneyRepository.save(jouney);
      return await this.jouneyRepository.findOne(jouneyId);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async fetchAllMyJouney(owner: User): Promise<Jouney[]> {
    try {
      return await this.jouneyRepository.find({
        where: { owner: { uuid: owner.uuid } },
        order: { createdAt: 'DESC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async countMarker(jouney: Jouney): Promise<number> {
    try {
      const markerCount = await this.markerRepository.count({
        jouney: { uuid: jouney.uuid },
      });
      return markerCount;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
