import { IsUUID } from "class-validator";
import * as bcrypt from 'bcrypt'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique , } from "typeorm";

@Entity("user")
@Unique(["username"])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsUUID('4')
    uuid: string

    @Column()
    username: string

    @Column({nullable: true})
    email: string

    @Column()
    password: string

    @Column()
    salt: string

    async validatePassword(password: string) : Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt)
        return (hash === this.password)
    }
}