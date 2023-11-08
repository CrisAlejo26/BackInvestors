import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'transactionrecord', synchronize: false })
export class Transactionrecord {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('bit', {
        nullable: true
    })
    autoexecuted: boolean;

    @Column('bit', {
        nullable: true
    })
    canbeallocatedforwithdrawal: boolean;

    @Column('bit', {
        nullable: true
    })
    canbecashedout: boolean;

    @Column('decimal', {
        nullable: true
    })
    cashamount: string;

    @Column('varchar', {
        nullable: true
    })
    cashcurrency: string;

    @Column('varchar', {
        nullable: true
    })
    cellphoneused: string;

    @Column('varchar', {
        nullable: true
    })
    cryptoaddress: string;

    @Column('decimal', {
        nullable: true
    })
    cryptoamount: string;

    @Column('varchar', {
        nullable: true
    })
    cryptocurrency: string;

    @Column('decimal', {
        nullable: true
    })
    cryptodiscountamount: string;

    @Column('text', {
        nullable: true
    })
    detail: string; // ! duda

    @Column('varchar', {
        nullable: true
    })
    discountcode: string;

    @Column('decimal', {
        nullable: true
    })
    discountquotient: string;

    @Column('int', {
        nullable: true
    })
    errorcode: number;

    @Column('int', {
        nullable: true
    })
    exchangestrategyused: number;

    @Column('decimal', {
        nullable: true
    })
    expectedprofitsetting: string;

    @Column('decimal', {
        nullable: true
    })
    expectedprofitvalue: string;

    @Column('datetime', {
        nullable: true
    })
    expiresat: Date;

    @Column('decimal', {
        nullable: true
    })
    feediscount: string;

    @Column('decimal', {
        nullable: true
    })
    fixedtransactionfee: string;

    @Column('varchar', {
        nullable: true
    })
    labels: string;

    @Column('varchar',{
        nullable: true
    })
    localtid: string;

    @Column('bigint', {
        nullable: true
    })
    locationid: string;

    @Column('varchar', {
        nullable: true
    })
    nameofcryptosettingused: string;

    @Column('text', {
        nullable: true
    })
    note: string;

    @Column('bit', {
        nullable: true
    })
    purchased: boolean;

    @Column('decimal', {
        nullable: true
    })
    ratesourceprice: string;

    @Column('varchar', {
        nullable: true
    })
    relatedremotetid: string;

    @Column('varchar', {
        nullable: true
    })
    remotetid: string;

    @Column('int', {
        nullable: true
    })
    resendattempts: number;

    @Column('bit', {
        nullable: true
    })
    risk: boolean;

    @Column('text', {
        nullable: true
    })
    scoringresult: string;

    @Column('datetime', {
        nullable: true
    })
    servertime: Date;

    @Column('bit', {
        nullable: true
    })
    sold: boolean;

    @Column('int', {
        nullable: true
    })
    status: number;

    @Column('datetime', {
        nullable: true
    })
    terminaltime: Date;

    @Column('varchar', {
        nullable: true
    })
    transactionimageid: string;

    @Column('int', {
        nullable: true
    })
    type: number;

    @Column('varchar', {
        nullable: true
    })
    uuid: string;

    @Column('bit', {
        nullable: true
    })
    withdrawn: boolean;

    @Column('bigint', {
        nullable: true
    })
    discount_id: string;

    @Column('bigint', {
        nullable: true
    })
    identity_id: string;

    @Column('bigint')
    terminal_id: string;

    @Column('varchar', {
        nullable: true
    })
    batchuid: string;

    @Column('text', {
        nullable: true
    })
    cryptoaddresslong: string;

}
