import { IsIn, IsUUID } from 'class-validator';
import { User } from 'src/auth/user.entity';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('jouney')
export class Jouney extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @IsUUID('4')
  createdUserId: string;

  @Column()
  @IsIn(['public', 'private'])
  visibility: string;

  @ManyToMany(
    () => User,
    user => user.groups,
  )
  members: User[];
}
