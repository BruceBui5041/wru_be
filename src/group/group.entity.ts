import { IsUUID } from 'class-validator';
import { User } from '../user/user.entity';
import { Jouney } from '../jouney/jouney.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('groups')
export class Group extends BaseEntity {
  constructor(creater: User) {
    super();
    this.owner = creater;
  }

  /**
   * -----------------------------------------------------
   */
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  @IsUUID()
  private _uuid: string;

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
  @OneToOne(() => Jouney, { onDelete: 'SET NULL' })
  private _jouney: Jouney;

  public get jouney(): Jouney {
    return this._jouney;
  }

  public set jouney(value: Jouney) {
    this._jouney = value;
  }

  public addNewMember = (newMember: User) => {
    this.members.push(newMember);
  };

  public removeMember = (removedMember: User) => {
    this._members = this.members.filter(member => member.uuid != removedMember.uuid);
  };
}
