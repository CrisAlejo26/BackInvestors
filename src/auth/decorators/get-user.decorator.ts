import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    
    ( data: string, ctx: ExecutionContext ) => {
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if ( !user ) {
            throw new InternalServerErrorException('Usuario no encontrado ( request )')
        }

        // Si no trae datos entonces muestra todo el usuario, sino entonces muestra el dato que buscamos
        return ( !data ) 
            ? user 
            : user[data];
    }
);