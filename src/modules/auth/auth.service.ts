import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { TokenType } from "./types/token.types";

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
    const refreshToken = await this.prisma.token.findFirst({
      where: {
        token,
        type: TokenType.REFRESH_TOKEN,
      },
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
      await tx.token.update({
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

    return {
      access_token: newAccessToken,
      refresh_token: result,
    };
  }

  async logout(token: string) {
    await this.prisma.token.updateMany({
      where: {
        token,
        type: TokenType.REFRESH_TOKEN,
      },
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
    await prismaClient.token.create({
      data: {
        token,
        userId,
        type: TokenType.REFRESH_TOKEN,
        expiresAt,
      },
    });

    return token;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      include: { role: true },
    });

    // Generate tokens
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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        message: "If the email exists, a password reset link has been sent",
      };
    }

    // Generate reset token
    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Save reset token
    await this.prisma.token.create({
      data: {
        token: resetToken,
        userId: user.id,
        type: TokenType.PASSWORD_RESET_TOKEN,
        expiresAt,
      },
    });

    // TODO: Send email with reset link
    // For now, we'll just return the token (in production, send via email)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return {
      message: "If the email exists, a password reset link has been sent",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.prisma.token.findFirst({
      where: {
        token,
        type: TokenType.PASSWORD_RESET_TOKEN,
      },
      include: { user: true },
    });

    if (
      !resetToken ||
      resetToken.isRevoked ||
      resetToken.expiresAt < new Date()
    ) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password and mark token as used
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      });

      await tx.token.update({
        where: { id: resetToken.id },
        data: { isRevoked: true },
      });
    });

    return { message: "Password has been reset successfully" };
  }
}
