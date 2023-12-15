import { Entity, PrimaryGeneratedColumn, Column,Unique,CreateDateColumn,UpdateDateColumn } from "typeorm";
import { IsNotEmpty, MinLength, isEmail } from "class-validator/types/decorator/decorators"
import * as bcrypt from 'bcrypt';
@Entity()
// @Unique(['firstName'])

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    // @MinLength(7)
    firstName: string

    @Column()
    lastName: string

    @Column()
    // @MinLength(8)
    password: string

    @Column()
    age: number

    @Column()
    phone:number

    @Column()
    gender:string

    @Column()
    // @IsNotEmpty()
    rol: string

    hashPassword():void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    async checkPassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
      }


}
