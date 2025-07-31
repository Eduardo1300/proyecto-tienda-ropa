import { CanActivate, ExecutionContext, Injectable, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Si no se especifican roles, permite el acceso
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role); // Evalúa si el usuario tiene el rol necesario
  }
}
