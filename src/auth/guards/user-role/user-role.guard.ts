import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { InversorAuth } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get( META_ROLES, context.getHandler() )

    const req = context.switchToHttp().getRequest();
    const user = req.user as InversorAuth;

    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;

    if ( !user ) {
        throw new InternalServerErrorException('Usuario no encontrado ( request )')
    }

    // Si no envian ningun parametro en el decorador de SetMetada entonces lo deja pasar
    if ( !validRoles ) return true;

    // Si el usuario que intenta acceder a la ruta tiene uno de los roles especificados en el decorador SetMetadata entonces lo deja pasar
    if ( validRoles.includes( user.roles ) ) {
        return true;
    }

    throw new ForbiddenException({
      message: {
        error: `Usuario ${ user.fullName } no tiene permisos o el rol necesario para acceder a este recurso`,
        rol_requerido: validRoles,
        rol_actual: user.roles
      },
      error: 'Forbidden',
      statusCode: 403
      }
    )
  }
}
