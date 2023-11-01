import { InversorDocument } from "../../files/entities/documentOne.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class InversorRegister {

    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column('varchar', {
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
        nullable: true
    })
    telephone?: string;

    @Column('varchar', {
        unique: true,
        nullable: true
    })
    dni?: string;

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

    @Column({
        type: 'varchar',
        nullable: true
    })
    atm?: string;

    @Column({
        nullable: true
    })
    percentage?: number

    @Column({
        type: 'varchar',
        nullable: true
    })
    idPay?: string;

    @OneToMany(
        () => InversorDocument,
        ( image ) => image.inversor,
        { 
            cascade: true,
            nullable: true
        }
    )
    documentImage?: InversorDocument[];
}
