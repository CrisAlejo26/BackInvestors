import { IsNumber, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateRegisterDto {

    @IsString()
    @IsOptional()
    @IsUUID()
    readonly id?: string;

    @IsOptional()
    @MinLength(6)
    @IsString({ message: "El nombre debe ser una cadena de texto" })
    readonly fullName?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    readonly email?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    readonly password?: string;

    @IsString()
    @IsOptional()
    readonly address?: string;

    @IsNumber()
    @IsOptional()
    readonly postalCode?: number;

    @IsNumber()
    @IsOptional()
    // @MinLength(6)
    readonly telephone?: number;

    @IsString()
    @IsOptional()
    readonly dni?: string;

    @IsString()
    @IsOptional()
    readonly dniImage?: string;

    @IsString()
    @IsOptional()
    readonly bussiness?: string;

    @IsString()
    @IsOptional()
    readonly nif?: string;

    @IsNumber()
    @IsOptional()
    readonly mountInversion?: number;

    @IsOptional()
    readonly createdAt?: Date;

    @IsOptional()
    readonly updatedAt?: Date;
}
