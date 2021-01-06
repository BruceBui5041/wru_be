import { IsUUID } from 'class-validator';
import { Group } from '../group/group.entity';
import { User } from '../user/user.entity';
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

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DENIED = 'denied',
  IGNORED = 'ignored',
  DESTROYED = 'destroyed',
}

@Entity('invitations')
export class Invitation extends BaseEntity {
  constructor(owner: User, invitedUser: User, group: any) {
    super();
    this.owner = owner;
    this.group = group;
    this.invitedUser = invitedUser;
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
  private _owner: User;

  @ManyToOne(
    () => User,
    user => user.invitations,
    { eager: true },
  )
  public get owner(): User {
    return this._owner;
  }

  public set owner(value: User) {
    this._owner = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _group: Group;

  @ManyToOne(
    () => Group,
    group => group.invitatons,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'groupUuid' })
  public get group(): Group {
    return this._group;
  }

  public set group(value: Group) {
    this._group = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _invitedUser: User;

  @ManyToOne(
    () => User,
    user => user.invitations,
    { eager: true },
  )
  public get invitedUser(): User {
    return this._invitedUser;
  }

  public set invitedUser(value: User) {
    this._invitedUser = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _status: InvitationStatus;

  @Column('enum', { enum: InvitationStatus, default: InvitationStatus.PENDING, name: 'status' })
  public get status(): InvitationStatus {
    return this._status;
  }

  public set status(value: InvitationStatus) {
    this._status = value;
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
}
