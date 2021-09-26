import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Jouney } from './jouney.entity';
import { JouneyRepository } from './jouney.repository';
import { InputJouneyDto } from './dto/input-jouney.dto';
import { UpdateJouneyDto } from './dto/update-jouney.dto';

@Injectable()
export class JouneyService {
  constructor(
    @InjectRepository(JouneyRepository)
    private readonly jouneyRepository: JouneyRepository,
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
        throw new NotFoundException();
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
      return await this.jouneyRepository.find({ owner });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
