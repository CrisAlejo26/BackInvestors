import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
    cashamount: number;

    @Column( {
        nullable: true
    })
    cashcurrency: string;

    @Column( {
        nullable: true
    })
    cellphoneused: string;

    @Column( {
        nullable: true
    })
    cryptoaddress: string;

    @Column('decimal', {
        nullable: true
    })
    cryptoamount: number;

    @Column( {
        nullable: true
    })
    cryptocurrency: string;

    @Column('decimal', {
        nullable: true
    })
    cryptodiscountamount: number;

    @Column('blob', {
        nullable: true
    })
    detail: Buffer;

    @Column( {
        nullable: true
    })
    discountcode: string;

    @Column('decimal', {
        nullable: true
    })
    discountquotient: number;

    @Column( {
        nullable: true
    })
    errorcode: number;

    @Column( {
        nullable: true
    })
    exchangestrategyused: number;

    @Column('decimal', {
        nullable: true
    })
    expectedprofitsetting: number;

    @Column('decimal', {
        nullable: true
    })
    expectedprofitvalue: number;

    @Column('datetime', {
        nullable: true
    })
    expiresat: Date;

    @Column('decimal', {
        nullable: true
    })
    feediscount: number;

    @Column('decimal', {
        nullable: true
    })
    fixedtransactionfee: number;

    @Column({
        nullable: true
    })
    labels: string;

    @Column({
        nullable: true
    })
    localtid: string;

    @Column({
        nullable: true
    })
    locationid: number;

    @Column({
        nullable: true
    })
    nameofcryptosettingused: string;

    @Column('blob', {
        nullable: true
    })
    note: Buffer;

    @Column('bit', {
        nullable: true
    })
    purchased: boolean;

    @Column('decimal', {
        nullable: true
    })
    ratesourceprice: number;

    @Column( {
        nullable: true
    })
    relatedremotetid: string;

    @Column( {
        nullable: true
    })
    remotetid: string;

    @Column({
        nullable: true
    })
    resendattempts: number;

    @Column('bit', {
        nullable: true
    })
    risk: boolean;

    @Column('blob', {
        nullable: true
    })
    scoringresult: Buffer;

    @Column('datetime', {
        nullable: true
    })
    servertime: Date;

    @Column('bit', {
        nullable: true
    })
    sold: boolean;

    @Column( {
        nullable: true
    })
    status: number;

    @Column('datetime', {
        nullable: true
    })
    terminaltime: Date;

    @Column({
        nullable: true
    })
    transactionimageid: string;

    @Column({
        nullable: true
    })
    type: number;

    @Column({
        nullable: true
    })
    uuid: string;

    @Column('bit', {
        nullable: true
    })
    withdrawn: boolean;

    @Column({
        nullable: true
    })
    discount_id: number;

    @Column({
        nullable: true
    })
    identity_id: number;

    @Column({
        nullable: true
    })
    terminal_id: number;

    @Column({
        nullable: true
    })
    batchuid: string;

    @Column('blob', {
        nullable: true
    })
    cryptoaddresslong: Buffer;


}
