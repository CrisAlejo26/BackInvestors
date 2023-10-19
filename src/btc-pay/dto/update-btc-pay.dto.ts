import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBtcPayDto {
    
    @IsNumber()
    @IsOptional()
    readonly amount: number;
    
    @IsString()
    @IsOptional()
    readonly email: string;

    @IsNumber()
    @IsOptional()
    readonly expiryDate: number;
}
