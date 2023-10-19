import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class InversorAuth {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', {
        unique: true
    })
    email: string;

    @Column('varchar', {
        // Nunca va a mostrar la contraseña cuando se haga una peticion de busqueda en base de datos
        select: false
    })
    password: string;

    @Column('varchar')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    // definiendo roles del login
    @Column({
        type: 'enum',
        enum: ['inversor', 'admin'],
        default: 'inversor'
    })
    roles: 'inversor' | 'admin';

}
