import { InversorRegister } from "../../register/entities/register.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class InversorDocument {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar')
    type: string;

    @Column('varchar')
    name: string;

    @Column('longblob')
    data: Buffer;

    @ManyToOne(
        () => InversorRegister,
        ( image ) => image.documentImage,
        {
            nullable: true
        }
    )
    inversor: InversorRegister;
}