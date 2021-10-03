import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JouneyRepository } from 'src/jouney/jouney.repository';
import { User } from 'src/user/user.entity';
import { InputMarkerDto } from './dto/input-marker.dto';
import { UpdateMarkerDto } from './dto/update-marker.dto';
import { Marker } from './marker.entity';
import { MarkerRepository } from './marker.repository';

@Injectable()
export class MarkerService {
  constructor(
    @InjectRepository(MarkerRepository) private readonly markerRepository: MarkerRepository,
    @InjectRepository(JouneyRepository) private readonly jouneyRepository: JouneyRepository,
  ) {}

  async create(owner: User, jouneyId: string, marker: InputMarkerDto): Promise<Marker> {
    try {
      const jouney = await this.jouneyRepository.findOne(jouneyId);
      if (!jouney) {
        throw new NotFoundException();
      }
      const newMarker = new Marker(owner, jouney, marker);
      return await this.markerRepository.save(newMarker);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async update(markerId: string, markerInfo: UpdateMarkerDto): Promise<Marker> {
    try {
      const {
        lat,
        lng,
        name,
        description,
        visibility,
        image,
        image1,
        image2,
        image3,
        image4,
        image5,
      } = markerInfo;
      const marker = await this.markerRepository.findOne(markerId);

      if (!marker) {
        throw new NotFoundException();
      }

      marker.name = name;
      marker.description = description;
      marker.visibility = visibility;
      marker.lat = lat;
      marker.lng = lng;
      marker.image = image;
      marker.image1 = image1;
      marker.image2 = image2;
      marker.image3 = image3;
      marker.image4 = image4;
      marker.image5 = image5;

      await this.markerRepository.save(marker);
      return await this.markerRepository.findOne(markerId);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async fetchAllMarkerByJouneyId(jouneyId: string): Promise<Marker[]> {
    try {
      return await this.markerRepository.find({
        where: { jouney: { uuid: jouneyId } },
        order: { createdAt: 'DESC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
