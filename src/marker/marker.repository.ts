import { EntityRepository, Repository } from 'typeorm';
import { Marker } from './marker.entity';

@EntityRepository(Marker)
export class MarkerRepository extends Repository<Marker> {}
