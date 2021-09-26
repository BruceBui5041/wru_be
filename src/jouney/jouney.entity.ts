import { IsIn, IsUUID, MaxLength } from 'class-validator';
import { User } from '../user/user.entity';
import { Marker } from '../marker/marker.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InputJouneyDto } from './dto/input-jouney.dto';
import { JouneyVisibility } from './jouney.enum';

@Entity('jouneys')
export class Jouney extends BaseEntity {
  constructor(owner: User, jouneyInfo?: InputJouneyDto) {
    super();
    this.owner = owner;
    if (jouneyInfo) {
      const { name, description, visibility, image } = jouneyInfo;
      this.name = name;
      this.description = description;
      this.visibility = visibility;
      this.image = image;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column({ length: 100 })
  @MaxLength(100)
  name: string;

  @Column({ nullable: true, length: 512 })
  @MaxLength(512)
  description: string;

  @Column({ nullable: true, length: 512 })
  image: string;

  @Column('enum', { enum: JouneyVisibility, default: JouneyVisibility.PRIVATE })
  visibility: JouneyVisibility;

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
    { eager: true },
  )
  @JoinColumn({ name: 'ownerUuid' })
  owner: User;

  @OneToMany(
    () => Marker,
    marker => marker.jouney,
  )
  markers: Marker[];
}
