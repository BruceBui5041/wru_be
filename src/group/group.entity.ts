import { IsUUID } from 'class-validator';
import { User } from 'src/auth/user.entity';
import { BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('group')
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  groupName: string;

  @Column()
  groupImageUrl: string;

  @Column()
  @IsUUID('4')
  createdUserId: string;

  @ManyToMany(
    () => User,
    user => user.groups,
  )
  members: User[];
}
