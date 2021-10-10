import { IsUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Group } from '../group/group.entity';
import { JoinInRequest } from '../join-in-request/join-in-request.entity';
import { Invitation } from '../invitations/invitation.entity';
import { UserProfile } from '../user-profile/user-profile.entity';
import { SharedJouney } from 'src/shared-jouney/shared-jouney.entity';

@Entity('user')
export class User extends BaseEntity {
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

  private _token: string;

  @Column({ type: 'text', name: 'token', nullable: true })
  public get token(): string {
    return this._token;
  }

  public set token(value: string) {
    this._token = value;
  }

  private _refreshToken: string;

  @Column({ type: 'text', name: 'refreshToken', nullable: true })
  public get refreshToken(): string {
    return this._refreshToken;
  }
  public set refreshToken(value: string) {
    this._refreshToken = value;
  }

  /**
   * -----------------------------------------------------
   */

  private _username: string;

  @Index('username-idx', { fulltext: true })
  @Column({ name: 'username', unique: true })
  public get username(): string {
    return this._username;
  }

  public set username(value: string) {
    this._username = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _email: string;

  @Index('email-idx', { fulltext: true })
  @Column({ name: 'email', nullable: true, unique: true })
  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _password: string;

  @Column({ name: 'password', nullable: true })
  public get password(): string {
    return this._password;
  }
  public set password(value: string) {
    this._password = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _salt: string;

  @Column({ name: 'salt', nullable: true })
  public get salt(): string {
    return this._salt;
  }

  public set salt(value: string) {
    this._salt = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
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
  private _groups: Group[];

  @OneToMany(() => Group, (group) => group.owner, { onDelete: 'CASCADE' })
  public get groups(): Group[] {
    return this._groups;
  }

  public set groups(value: Group[]) {
    this._groups = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _invitations: Invitation[];

  @OneToMany(() => Invitation, (invitation) => invitation.owner)
  public get invitations(): Invitation[] {
    return this._invitations;
  }

  public set invitations(value: Invitation[]) {
    this._invitations = value;
  }

  /**
   * -----------------------------------------------------
   */
  private _joinInRequest: JoinInRequest[];

  @OneToMany(() => JoinInRequest, (joinInRequest) => joinInRequest.owner)
  public get joinInRequests(): JoinInRequest[] {
    return this._joinInRequest;
  }

  public set joinInRequests(value: JoinInRequest[]) {
    this._joinInRequest = value;
  }

  private _profile: UserProfile;

  @OneToOne(() => UserProfile, (user) => user.owner, { eager: true })
  @JoinColumn()
  public get profile(): UserProfile {
    return this._profile;
  }

  @OneToMany((type) => SharedJouney, (sharedJouney) => sharedJouney.jouneyOwner)
  sharedJouney: SharedJouney[];

  public set profile(value: UserProfile) {
    this._profile = value;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
