import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Roles } from "../../prisma/generated/prisma";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@/decorators/roles.decorator";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtRolesGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isJwtValid = (await super.canActivate(context)) as boolean;

        if (!isJwtValid) {
            return false;
        }

        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('Пользователь не авторизован');
        }

        const hasRequiredRole = requiredRoles.some((role) => user.role === role);

        if (!hasRequiredRole) {
            throw new UnauthorizedException('Недостаточно прав для выполнения действия');
        }

        return true;
    }
}