import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ROLES_KEY } from "../decorators/admin-role.decorator";
import { RoleType } from "../types/role.types";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    if (!user.role?.name) {
      throw new ForbiddenException("User role not found");
    }

    const hasRole = requiredRoles.includes(user.role.name as RoleType);
    if (!hasRole) {
      throw new ForbiddenException(
        `Required roles: ${requiredRoles.join(", ")}. User role: ${
          user.role.name
        }`
      );
    }

    return true;
  }
}
