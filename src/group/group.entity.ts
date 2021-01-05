import { IsUUID } from 'class-validator';
import { User } from '../user/user.entity';
import { Jouney } from '../jouney/jouney.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invitation } from '../invitations/invitation.entity';

@Entity('groups')
export class Group extends BaseEntity {
  constructor(creater: User) {
    super();
    this.owner = creater;
  }

  /**
   * -----------------------------------------------------
   */
  private _uuid: string;

  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  @IsUUID()
  public get uuid(): string {
    return this._uuid;
  }

  public set uuid(value: string) {
    this._uuid = value;
  }

  /**
   * -----------------------------------------------------
   */
  @Column({ name: 'groupName' })
  private _groupName: string;

  public get groupName(): string {
    return this._groupName;
  }

  public set groupName(value: string) {
    this._groupName = value;
  }

  /**
   * -----------------------------------------------------
   */
  @Column({ nullable: true, name: 'description' })
  private _description: string;

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }

  /**
   * -----------------------------------------------------
   */
  @Column({ nullable: true, name: 'groupImageUrl' })
  private _groupImageUrl: string;

  public get groupImageUrl(): string {
    return this._groupImageUrl;
  }

  public set groupImageUrl(value: string) {
    this._groupImageUrl = value;
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

  /**
   * -----------------------------------------------------
   */
  @ManyToOne(
    () => User,
    user => user.groups,
  )
  /**
   * Use JoinColumn to rename the foreign key
   */
  @JoinColumn({ name: 'ownerUuid' })
  private _owner: User;

  public get owner(): User {
    return this._owner;
  }

  public set owner(value: User) {
    this._owner = value;
  }

  /**
   * -----------------------------------------------------
   */
  @ManyToMany(() => User)
  @JoinTable({ name: 'group_users_user' })
  private _members: User[];

  public get members(): User[] {
    return this._members;
  }

  /**
   * -----------------------------------------------------
   */
  private _jouney: Jouney;

  @OneToOne(() => Jouney, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'jouneyUuid' })
  public get jouney(): Jouney {
    return this._jouney;
  }

  public set jouney(value: Jouney) {
    this._jouney = value;
  }

  private _invitatons: Invitation[];

  @OneToMany(
    () => Invitation,
    invitation => invitation.group,
  )
  public get invitatons(): Invitation[] {
    return this._invitatons;
  }
  public set invitatons(value: Invitation[]) {
    this._invitatons = value;
  }
}
