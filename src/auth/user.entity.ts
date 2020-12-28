import { IsPhoneNumber, IsUrl, IsUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserGraphQLType } from './user.gql.type';
import { Group } from 'src/group/group.entity';

@Entity('user')
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsUUID('4')
  uuid: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  @IsPhoneNumber('vn')
  phoneNumber: string;

  @Column()
  @IsUrl()
  imageUrl: string;

  @ManyToMany(
    () => Group,
    group => group.members,
  )
  groups: Group[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }

  getPublicInfomation(): UserGraphQLType {
    return {
      id: this.id,
      email: this.email,
      phoneNumber: this.phoneNumber,
      imageUrl: this.imageUrl,
      username: this.username,
    };
  }
}
