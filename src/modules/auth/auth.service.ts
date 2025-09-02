import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role?.name,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(token: string) {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: { include: { role: true } } },
    });

    if (
      !refreshToken ||
      refreshToken.isRevoked ||
      refreshToken.expiresAt < new Date()
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const payload = {
      email: refreshToken.user.email,
      sub: refreshToken.user.id,
      role: refreshToken.user.role?.name,
    };

    const newAccessToken = this.jwtService.sign(payload);

    // Use transaction for atomicity of operations
    const result = await this.prisma.$transaction(async (tx) => {
      // First, revoke the old token
      await tx.refreshToken.update({
        where: { id: refreshToken.id },
        data: { isRevoked: true },
      });

      // Then create a new token
      const newRefreshToken = await this.createRefreshToken(
        refreshToken.user.id,
        tx
      );

      return newRefreshToken;
    });

    console.log("newAccessToken", newAccessToken);
    console.log("newRefreshToken", result);

    return {
      access_token: newAccessToken,
      refresh_token: result,
    };
  }

  async logout(token: string) {
    await this.prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
    return { message: "Successfully logged out" };
  }

  private async createRefreshToken(userId: number, tx?: any): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date();
    const refreshTokenExpiresIn =
      this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN") || "7d";

    // Parse time string (e.g., '7d' -> 7 days)
    if (refreshTokenExpiresIn.endsWith("d")) {
      const days = parseInt(refreshTokenExpiresIn.slice(0, -1));
      expiresAt.setDate(expiresAt.getDate() + days);
    } else if (refreshTokenExpiresIn.endsWith("h")) {
      const hours = parseInt(refreshTokenExpiresIn.slice(0, -1));
      expiresAt.setHours(expiresAt.getHours() + hours);
    } else {
      // Default to 7 days
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    const prismaClient = tx || this.prisma;
    await prismaClient.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}
