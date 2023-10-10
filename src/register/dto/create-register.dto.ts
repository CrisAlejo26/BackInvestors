import { IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateRegisterDto {

    @IsString()
    @IsOptional()
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
    @MinLength(6)
    readonly address?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    readonly postalCode?: string;

    @IsNumber()
    @IsOptional()
    // @MinLength(6)
    readonly telephone?: number;

    @IsString()
    @IsOptional()
    @MinLength(6)
    readonly dni?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    readonly dniImage?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    readonly bussiness?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    readonly nif?: string;

    @IsNumber()
    @IsOptional()
    @MinLength(6)
    readonly mountInversion?: number;

    @IsOptional()
    readonly createdAt?: Date;

    @IsOptional()
    readonly updatedAt?: Date;
}
