import { IsUUID } from 'class-validator';
import { PubSub } from 'graphql-subscriptions';
import { Jouney } from 'src/jouney/jouney.entity';
import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity('shared-jouneys')
export class SharedJouney extends BaseEntity {
  constructor(jouney: Jouney, jouneyOwner: User, sharedUser: User) {
    super();

    this.jouney = jouney;
    this.jouneyOwner = jouneyOwner;
    this.sharedUser = sharedUser;
  }

  @Column()
  @Generated('uuid')
  @IsUUID()
  uuid: string;

  @Column('bool', { default: false })
  checked: boolean;

  @Column('bool', { default: false })
  accepted: boolean;

  @ManyToOne((type) => Jouney, (jouney) => jouney.sharedJouney, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  jouney: Jouney;

  @ManyToOne((type) => User, (user) => user.sharedJouney, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  jouneyOwner: User;

  @ManyToOne((type) => User, (user) => user.sharedJouney, {
    primary: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  sharedUser: User;

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
}
