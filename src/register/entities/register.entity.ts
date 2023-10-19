import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class InversorRegister {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar', {
        unique: true,
        nullable: true
    })
    fullName?: string;

    @Column('varchar', {
        unique: true,
        nullable: true,
    })
    email?: string;

    @Column({
        nullable: true,
    })
    password?: string;

    @Column({
        nullable: true,
    })
    createdAt?: Date;

    @Column({
        nullable: true,
    })
    updatedAt?: Date;

    @Column({
        nullable: true,
    })
    address?: string;

    @Column({
        nullable: true,
    })
    postalCode?: number;

    @Column({
        nullable: true,
        unique: true,
    })
    telephone?: number;

    @Column('varchar', {
        unique: true,
        nullable: true
    })
    dni?: string;

    @Column({
        nullable: true,
    })
    dniImage?: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    bussiness?: string;

    @Column({
        type: 'varchar',
        nullable: true,
        unique: true
    })
    nif?: string;

    @Column({
        nullable: true,
    })
    mountInversion?: number;
}
