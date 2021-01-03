import { IsIn, IsNumber, IsUUID, Max, Min } from 'class-validator';
import { User } from '../user/user.entity';
import { Jouney } from '../jouney/jouney.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column('enum', { enum: ['public', 'private'] })
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

  @ManyToOne(
    () => Jouney,
    jouney => jouney.markers,
  )
  @JoinColumn({ name: 'jouneyUuid' })
  jouney: Jouney;
}
