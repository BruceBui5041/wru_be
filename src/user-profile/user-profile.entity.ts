import { IsUrl, IsUUID } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Entity('user_profile')
export class UserProfile extends BaseEntity {
  private _uuid: string;

  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  @IsUUID()
  public get uuid(): string {
    return this._uuid;
  }

  public set uuid(value: string) {
    this._uuid = value;
  }

  private _phoneNumber: string;

  @Column({ name: 'phoneNumber', nullable: true })
  public get phoneNumber(): string {
    return this._phoneNumber;
  }
  public set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  private _avatarUrl: string;

  @Column({ name: 'avatarUrl', nullable: true })
  @IsUrl()
  public get avatarUrl(): string {
    return this._avatarUrl;
  }
  public set avatarUrl(value: string) {
    this._avatarUrl = value;
  }

  private _status: string;

  @Column({ name: 'status', nullable: true })
  public get status(): string {
    return this._status;
  }
  public set status(value: string) {
    this._status = value;
  }

  private _placesWantToGoTo: string;

  @Column({ name: 'places', nullable: true })
  public get placesWantToGoTo(): string {
    return this._placesWantToGoTo;
  }
  public set placesWantToGoTo(value: string) {
    this._placesWantToGoTo = value;
  }

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

  private _owner: User;

  @OneToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerUuid' })
  public get owner(): User {
    return this._owner;
  }
  public set owner(value: User) {
    this._owner = value;
  }

  createNewUserProfile(owner: User, updateProfileDto: UpdateProfileDto) {
    const { avatarUrl, phoneNumber, placesWantToGoTo, status } = updateProfileDto;
    this.owner = owner;
    this.avatarUrl = avatarUrl;
    this.phoneNumber = phoneNumber;
    this.placesWantToGoTo = placesWantToGoTo;
    this.status = status;
  }
}
