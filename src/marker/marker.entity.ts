import { IsIn, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
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
import { MarkerVisibility } from './marker.enum';
import { InputMarkerDto } from './dto/input-marker.dto';

@Entity('markers')
export class Marker extends BaseEntity {
  constructor(owner: User, jouney: Jouney, marker?: InputMarkerDto) {
    super();
    this.owner = owner;
    this.jouney = jouney;
    if (marker) {
      const { lat, lng, name, description, visibility, image } = marker;
      this.lat = lat;
      this.lng = lng;
      this.name = name;
      this.description = description;
      this.visibility = visibility;
      this.image = image;
    }
  }

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string;

  @Column({ nullable: true, length: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @Column({ nullable: true, length: 512 })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string;

  @Column({ type: 'double precision' })
  @IsNumber()
  @Max(180)
  @Min(-180)
  lng: number;

  @Column({ type: 'double precision' })
  @IsNumber()
  @Max(90)
  @Min(-90)
  lat: number;

  @Column('enum', { enum: MarkerVisibility, default: MarkerVisibility.PUBLIC })
  @IsIn(Object.values(MarkerVisibility))
  visibility?: MarkerVisibility = MarkerVisibility.PUBLIC;

  @Column({ nullable: true })
  @IsString()
  image?: string;

  @Column({ nullable: true })
  @IsString()
  image1?: string;

  @Column({ nullable: true })
  @IsString()
  image2?: string;

  @Column({ nullable: true })
  @IsString()
  image3?: string;

  @Column({ nullable: true })
  @IsString()
  image4?: string;

  @Column({ nullable: true })
  @IsString()
  image5?: string;

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

  @ManyToOne(
    () => Jouney,
    jouney => jouney.markers,
    { eager: true },
  )
  @JoinColumn({ name: 'jouneyUuid' })
  jouney: Jouney;
}
