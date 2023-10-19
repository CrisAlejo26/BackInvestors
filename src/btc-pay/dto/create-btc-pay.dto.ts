import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBtcPayDto {

    @IsNumber()
    readonly amount: number;
    
    @IsString()
    readonly email: string;

    @IsNumber()
    readonly expiryDate: number;

    @IsString()
    @IsOptional()
    readonly title?: string;

    @IsString()
    @IsOptional()
    readonly currency?: string;

    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsBoolean()
    @IsOptional()
    readonly allowCustomPaymentAmounts?: boolean;

    @IsOptional()
    @IsUUID()
    readonly formId?: string;
}
