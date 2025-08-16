import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Verificar si el usuario es administrador
    // Esto debería basarse en el rol del usuario en la base de datos
    const isAdmin = user.role === 'admin' || user.isAdmin === true;

    if (!isAdmin) {
      throw new ForbiddenException('Acceso denegado. Se requieren permisos de administrador');
    }

    return true;
  }
}
