import { PartialType } from '@nestjs/mapped-types';
import { CreateRegisterDto } from './create-register.dto';
import { IsNumber, IsOptional, IsString, IsUUID, Min, MinLength, min } from 'class-validator';
import { InversorDocument } from 'src/files/entities/documentOne.entity';

export class UpdateRegisterDto extends PartialType(CreateRegisterDto) {

    @IsString()
    @IsOptional()
    @IsUUID()
    readonly id?: string;

    @IsOptional()
    @MinLength(6, { message: "El nombre debe tener mas de 6 caracteres" })
    @IsString()
    readonly fullName?: string;

    @IsString()
    @IsOptional()
    @MinLength(6, { message: "El email debe ser mayor a 6 caracteres y debe tener una @" })
    readonly email?: string;

    @IsString()
    @IsOptional()
    @MinLength(6, { message: "La contraseña debe ser mayor a 6 caracteres" })
    readonly password?: string;

    @IsString()
    @IsOptional()
    @MinLength(6, { message: "La dirección debe ser mayor a 6 caracteres" })
    readonly address?: string;

    @IsNumber()
    @IsOptional()
    @Min(4, { message: "El código postal debe ser mayor a 4 caracteres" })
    readonly postalCode?: number;

    @IsNumber()
    @IsOptional()
    @Min(9, { message: "El telefono debe ser mayor a 9 caracteres" })
    readonly telephone?: number;

    @IsString()
    @IsOptional()
    @MinLength(8, { message: "El DNI debe ser mayor a 8 caracteres" })
    readonly dni?: string;

    @IsString()
    @IsOptional()
    readonly dniImage?: string;

    @IsString()
    @IsOptional()
    @MinLength(8, { message: "El nombre de la empresa debe ser mayor a 5 caracteres" })
    readonly bussiness?: string;

    @IsString()
    @IsOptional()
    @MinLength(8, { message: "El NIF debe ser mayor a 8 caracteres" })
    readonly nif?: string;

    @IsNumber()
    @IsOptional()
    readonly mountInversion?: number;

    @IsOptional()
    documentImage?: InversorDocument[];

    @IsOptional()
    readonly createdAt?: Date;

    @IsOptional()
    readonly updatedAt?: Date;

    @IsOptional()
    images?: Express.Multer.File[];

}
