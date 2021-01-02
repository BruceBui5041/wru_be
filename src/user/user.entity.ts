import { IsUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from '../group/group.entity';
import { Expose } from 'class-transformer';

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

  @Column({ name: 'token', nullable: true })
  public get token(): string {
    return this._token;
  }

  public set token(value: string) {
    this._token = value;
  }

  private _refreshToken: string;

  @Column({ name: 'refreshToken', nullable: true })
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

  @Column({ name: 'email', nullable: true })
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

  private _groups: Group[];

  @OneToMany(
    () => Group,
    group => group.owner,
    { onDelete: 'CASCADE' },
  )
  public get groups(): Group[] {
    return this._groups;
  }

  public set groups(value: Group[]) {
    this._groups = value;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
