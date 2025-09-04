import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User, Token } from "@prisma/client";

export interface ResetTokenData {
  user: User;
  token: Token;
}

export const ResetToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ResetTokenData => {
    const request = ctx.switchToHttp().getRequest();
    return request.resetTokenData;
  }
);
