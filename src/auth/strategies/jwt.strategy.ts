import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InversorAuth } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt.strategy.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( InversorAuth )
        private readonly inversorAuthRepository: Repository<InversorAuth>,
        private readonly configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate( payload: JwtPayload ): Promise<InversorAuth>{

        const { id } = payload;
        
        const user = await this.inversorAuthRepository.findOneBy({ id });

        if ( !user ) {
            throw new UnauthorizedException('Token invalido')
        }

        if ( !user.isActive ) {
            throw new UnauthorizedException('Usuario inactivo, habla con un administrador')
        }

        return user;
    }

}