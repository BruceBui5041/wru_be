import { IsIn, IsNumber, IsUUID, Max, Min } from 'class-validator';
import { User } from '../user/user.entity';
import { Jouney } from '../jouney/jouney.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('markers')
export class Marker extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column()
  title: string;

  @Column()
  @IsNumber()
  @Max(180)
  @Min(-180)
  lng: number;

  @Column()
  @IsNumber()
  @Max(90)
  @Min(-90)
  lat: number;

  @Column()
  @IsIn(['public', 'private'])
  visibility: string;

  @ManyToOne(
    () => User,
    user => user,
  )
  @JoinColumn({ name: 'ownerUuid' })
  owner: User;

  @ManyToOne(
    () => Jouney,
    jouney => jouney.markers,
  )
  @JoinColumn({ name: 'jouneyUuid' })
  jouney: Jouney;
}
