import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { MailService } from "../mail/mail.service";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { TokenType } from "./types/token.types";
import { RefreshTokenData } from "./decorators/refresh-token.decorator";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
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

  async refreshToken(refreshTokenData: RefreshTokenData) {
    const { user, token: refreshToken } = refreshTokenData;

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role?.name,
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
      const newRefreshToken = await this.createRefreshToken(user.id, tx);

      return newRefreshToken;
    });

    return {
      access_token: newAccessToken,
      refresh_token: result,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async logout(token: string) {
    // Find all refresh tokens and check which one matches
    const tokens = await this.prisma.token.findMany({
      where: {
        type: TokenType.REFRESH_TOKEN,
        isRevoked: false,
      },
    });

    // Find the matching token by comparing with hashed values
    for (const dbToken of tokens) {
      const isMatch = await bcrypt.compare(token, dbToken.token);
      if (isMatch) {
        await this.prisma.token.update({
          where: { id: dbToken.id },
          data: { isRevoked: true },
        });
        break;
      }
    }

    return { message: "Successfully logged out" };
  }

  private async createRefreshToken(userId: number, tx?: any): Promise<string> {
    const token = uuidv4();
    const hashedToken = await bcrypt.hash(token, 10); // Hash the token before storing
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
        token: hashedToken, // Store hashed token
        userId,
        type: TokenType.REFRESH_TOKEN,
        expiresAt,
      },
    });

    return token; // Return original token to client
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
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
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
      await tx.token.create({
        data: {
          token: resetToken,
          userId: user.id,
          type: TokenType.PASSWORD_RESET_TOKEN,
          expiresAt,
        },
      });

      // Send email with reset link
      try {
        await this.mailService.sendPasswordRecoveryToken(email, resetToken);
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        // Don't throw error - continue execution to maintain security
      }

      return {
        message: "If the email exists, a password reset link has been sent",
      };
    }, {
      maxWait: 60000, // 60 seconds
      timeout: 60000, // 60 seconds
    });
  }

  async resetPassword(token: string, newPassword: string, userId: number) {
    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password, mark reset token as used, create refresh token, and get user data
    const result = await this.prisma.$transaction(async (tx) => {
      // Update password
      const user = await tx.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
        include: { role: true },
      });

      // Revoke all reset tokens for this user
      await tx.token.updateMany({
        where: {
          token,
          type: TokenType.PASSWORD_RESET_TOKEN,
          userId,
        },
        data: { isRevoked: true },
      });

      // Create new refresh token
      const refreshToken = await this.createRefreshToken(userId, tx);

      return { user, refreshToken };
    });

    // Generate access token
    const payload = {
      email: result.user.email,
      sub: result.user.id,
      role: result.user.role?.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      refresh_token: result.refreshToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
    };
  }
}
