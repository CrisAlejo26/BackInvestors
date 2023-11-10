import { IsDate, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateAuthDto {

    @IsString()
    @IsEmail()
    readonly email: string

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'The password must have a Uppercase, lowercase letter and a number'
        }
    )
    readonly password: string

    @IsString()
    @MinLength(5)
    readonly fullName: string

    @IsNumber()
    @IsOptional()
    percentage?: number

    @IsDate()
    @IsOptional()
    inversionActiveDate?: Date;


    @IsNumber()
    @IsOptional()
    mountInversion?: number;

    @IsString()
    @IsOptional()
    atm?: string;
}
