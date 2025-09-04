import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Token, Role } from "@prisma/client";

export interface RefreshTokenData {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    password: string;
    roleId: number;
    role: Role | null;
  };
  token: Token;
}

export const RefreshToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RefreshTokenData => {
    // Try both GraphQL and HTTP contexts
    let request;
    try {
      const gqlCtx = GqlExecutionContext.create(ctx);
      request = gqlCtx.getContext().req;
    } catch {
      request = ctx.switchToHttp().getRequest();
    }

    if (!request?.refreshTokenData) {
      throw new Error(
        "refreshTokenData is not set. Make sure RefreshTokenGuard is applied before this decorator."
      );
    }
    return request.refreshTokenData;
  }
);
