import { IsIn, IsUUID } from 'class-validator';
import { User } from '../user/user.entity';
import { Group } from '../group/group.entity';
import { Marker } from '../marker/marker.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  /**
   * -----------------------------------------------------
   */
  private _createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public get createdAt(): Date {
    return this._createdAt;
  }

  public set createdAt(value: Date) {
    this._createdAt = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _updatedAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  @ManyToOne(
    () => User,
    user => user,
  )
  @JoinColumn({ name: 'ownerUuid' })
  owner: User;

  @OneToMany(
    () => Marker,
    marker => marker.jouney,
  )
  markers: Marker[];
}
