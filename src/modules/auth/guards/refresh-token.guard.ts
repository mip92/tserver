import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { PrismaService } from "../../../prisma/prisma.service";
import { TokenType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Get refresh token from headers (more secure than body)
    const refreshToken = request.headers["x-refresh-token"];

    if (!refreshToken) {
      throw new UnauthorizedException(
        "Refresh token is required in x-refresh-token header"
      );
    }

    // Find all refresh tokens for the user (we need to check against hashed tokens)
    const tokens = await this.prisma.token.findMany({
      where: {
        type: TokenType.REFRESH_TOKEN,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: { user: { include: { role: true } } },
    });

    // Check if any of the tokens matches the provided refresh token
    let validToken = null;
    for (const token of tokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.token);
      if (isMatch) {
        validToken = token;
        break;
      }
    }

    if (!validToken) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    // Attach user and token data to request for use in resolver
    request.refreshTokenData = {
      user: validToken.user,
      token: validToken,
    };

    return true;
  }
}
