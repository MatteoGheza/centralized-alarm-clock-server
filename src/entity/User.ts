import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    username: string;

    @Column({ type: 'text', nullable: true })
    name!: string;

    @Column("text")
    password: string;

    @Column({ type: 'boolean', default: false})
    isHidden: boolean;
}