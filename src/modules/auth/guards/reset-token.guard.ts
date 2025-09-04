import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { TokenType } from "@prisma/client";

@Injectable()
export class ResetTokenGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers["x-reset-token"];

    if (!token) {
      throw new UnauthorizedException(
        "Reset token is required in x-reset-token header"
      );
    }

    try {
      // Find the reset token in database
      const resetToken = await this.prisma.token.findFirst({
        where: {
          token: token,
          type: TokenType.PASSWORD_RESET_TOKEN,
          isRevoked: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!resetToken) {
        throw new UnauthorizedException("Invalid or expired reset token");
      }

      // Attach user and token to request for use in resolver
      request.resetTokenData = {
        user: resetToken.user,
        token: resetToken,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid reset token");
    }
  }
}
