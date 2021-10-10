import { IsUUID } from 'class-validator';
import { User } from '../user/user.entity';
import { Jouney } from '../jouney/jouney.entity';
import {
  AfterInsert,
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
  static joinUserTable = {
    tableName: 'group_user',
    userUuid: 'userUuid',
    groupUuid: 'groupUuid',
  };

  static columnNames = {
    uuid: 'uuid',
    groupName: 'groupName',
    description: 'description',
    groupImageUrl: 'groupImageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  };

  constructor(creater: User) {
    super();
    this.owner = creater;
  }

  /**
   * -----------------------------------------------------
   */
  private _uuid: string;

  @PrimaryGeneratedColumn('uuid', { name: Group.columnNames.uuid })
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
  @Column({ name: Group.columnNames.groupName })
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
  @Column({ nullable: true, name: 'groupImageUrl', length: 512 })
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

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'createdAt',
  })
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
    name: 'updatedAt',
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
  private _owner: User;

  @ManyToOne(() => User, (user) => user.groups, { eager: true })
  public get owner(): User {
    return this._owner;
  }

  public set owner(value: User) {
    this._owner = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _members: User[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: Group.joinUserTable.tableName,
    joinColumn: {
      referencedColumnName: 'uuid',
      name: Group.joinUserTable.groupUuid,
    },
    inverseJoinColumn: {
      referencedColumnName: 'uuid',
      name: Group.joinUserTable.userUuid,
    },
  })
  public get members(): User[] {
    return this._members;
  }

  public set members(value: User[]) {
    this._members = value;
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

  /**
   * -----------------------------------------------------
   */
  private _invitatons: Invitation[];

  @OneToMany(() => Invitation, (invitation) => invitation.group, {
    onDelete: 'CASCADE',
  })
  public get invitatons(): Invitation[] {
    return this._invitatons;
  }

  public set invitatons(value: Invitation[]) {
    this._invitatons = value;
  }

  // @AfterInsert()
  // triggerOnChangeGroup() {
  //   this.pubSub.publish('onChangeGroup', this);
  // }
}
