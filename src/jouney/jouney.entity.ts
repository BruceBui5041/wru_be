import { IsIn, IsUUID } from 'class-validator';
import { User } from '../user/user.entity';
import { Group } from '../group/group.entity';
import { Marker } from '../marker/marker.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('jouneys')
export class Jouney extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column()
  title: string;

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
    () => Group,
    group => group.jouney,
  )
  @JoinColumn({ name: 'groupUuid' })
  group: Group;

  @OneToMany(
    () => Marker,
    marker => marker.jouney,
  )
  markers: Marker[];
}
