import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ADMIN_ROLE_KEY } from "../decorators/admin-role.decorator";

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireAdminRole = this.reflector.getAllAndOverride<boolean>(
      ADMIN_ROLE_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requireAdminRole) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    if (user.role?.name !== "admin") {
      throw new ForbiddenException("Admin role required");
    }

    return true;
  }
}
