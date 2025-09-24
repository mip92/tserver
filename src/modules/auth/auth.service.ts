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
import { SmsService } from "../sms/sms.service";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { TokenType, JwtPayload } from "./types/token.types";
import {
  UserForLogin,
  UserVerificationUpdateData,
  UserGoBackUpdateData,
} from "./types/user.types";
import { RefreshTokenData } from "./decorators/refresh-token.decorator";
import {
  StartRegistrationInput,
  StartRegistrationResponse,
  VerifyCodeInput,
  VerifyCodeResponse,
  SetPasswordInput,
  SetPasswordResponse,
  SetPersonalInfoInput,
  SetPersonalInfoResponse,
  ResendCodeInput,
  ResendCodeResponse,
  GoBackStepInput,
  MessageResponse,
} from "./auth.model";
import { RoleType } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly smsService: SmsService
  ) {}

  async validateUser(
    email?: string,
    phone?: string,
    password?: string
  ): Promise<any> {
    // Validate that exactly one of email or phone is provided
    const hasEmail = email && email.trim() !== "";
    const hasPhone = phone && phone.trim() !== "";

    if (!hasEmail && !hasPhone) {
      throw new BadRequestException("Either email or phone must be provided");
    }

    if (hasEmail && hasPhone) {
      throw new BadRequestException(
        "Only one of email or phone should be provided"
      );
    }

    // Try to find user by email or phone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
      include: { role: true },
    });

    if (user && password && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserForLogin) {
    const payload = this.createJwtPayload(user);
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshTokenData: RefreshTokenData) {
    const { user, token: refreshToken } = refreshTokenData;

    const payload = this.createJwtPayload(user);
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
        phone: user.phone,
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

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async forgotPassword(data: { email?: string; phone?: string }) {
    const { email, phone } = data;

    // Validate that exactly one of email or phone is provided
    const hasEmail = email && email.trim() !== "";
    const hasPhone = phone && phone.trim() !== "";

    if (!hasEmail && !hasPhone) {
      throw new BadRequestException("Either email or phone must be provided");
    }

    if (hasEmail && hasPhone) {
      throw new BadRequestException(
        "Only one of email or phone should be provided"
      );
    }

    // All database operations in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      let user;

      if (email) {
        user = await tx.user.findUnique({
          where: { email },
        });
      } else if (phone) {
        user = await tx.user.findFirst({
          where: { phone },
        });
      }

      if (!user) {
        // Don't reveal if user exists or not for security
        return {
          message: "If the account exists, a password reset code has been sent",
          shouldSendCode: false,
          method: email ? "email" : "sms",
        };
      }

      // Generate 4-digit code for SMS or UUID for email
      const resetCode = email ? uuidv4() : this.generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes

      // Save reset token
      await tx.token.create({
        data: {
          token: resetCode,
          userId: user.id,
          type: email
            ? TokenType.PASSWORD_RESET_TOKEN
            : TokenType.SMS_PASSWORD_RESET_TOKEN,
          expiresAt,
        },
      });

      return {
        message: "If the account exists, a password reset code has been sent",
        shouldSendCode: true,
        method: email ? "email" : "sms",
        code: resetCode, // For testing purposes
      };
    });

    // Send code OUTSIDE transaction (slow operation)
    if (result.shouldSendCode) {
      try {
        if (email) {
          await this.mailService.sendPasswordRecoveryToken(email, result.code);
        } else if (phone) {
          await this.smsService.sendPasswordResetCode(phone, result.code);
        }
      } catch (error) {
        console.error("Failed to send password reset code:", error);
        // Don't throw error - continue execution to maintain security
      }
    }

    return {
      message: result.message,
    };
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private createJwtPayload(user: {
    id: number;
    email?: string;
    phone?: string;
    role?: { name: string };
  }): JwtPayload {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role?.name,
    };
  }

  // Multi-step registration methods

  async startRegistration(
    data: StartRegistrationInput
  ): Promise<StartRegistrationResponse> {
    const { email, phone } = data;

    // Validate that at least one of email or phone is provided
    const hasEmail = email && email.trim() !== "";
    const hasPhone = phone && phone.trim() !== "";

    if (!hasEmail && !hasPhone) {
      throw new BadRequestException("Either email or phone must be provided");
    }

    // If both email and phone are provided, prioritize email for verification
    const verifyEmail = hasEmail;
    const verifyPhone = hasPhone && !hasEmail;

    // Generate 6-digit verification code
    const verificationCode = this.generateVerificationCode();
    const hashedCode = await this.hashPassword(verificationCode);
    const expiresAt = new Date();

    expiresAt.setMinutes(expiresAt.getMinutes() + 20); // Code expires in 20 minutes

    // Check if user already exists and is fully registered
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [email ? { email } : {}, phone ? { phone } : {}].filter(
          (condition) => Object.keys(condition).length > 0
        ),
        password: { not: null }, // User has password (fully registered)
      },
    });

    if (existingUser) {
      throw new ConflictException("User is already registered");
    }

    // Check if user exists and registration is completed (step 5)
    const completedUser = await this.prisma.user.findFirst({
      where: {
        OR: [email ? { email } : {}, phone ? { phone } : {}].filter(
          (condition) => Object.keys(condition).length > 0
        ),
        registrationStep: 5,
      },
    });

    if (completedUser) {
      throw new ConflictException("Registration is already completed");
    }

    // Check if user exists but is in registration process
    const userInProcess = await this.prisma.user.findFirst({
      where: {
        OR: [email ? { email } : {}, phone ? { phone } : {}].filter(
          (condition) => Object.keys(condition).length > 0
        ),
        password: null, // User is in registration process
      },
    });

    let user;
    if (userInProcess) {
      // Update existing user in process with new verification code
      user = await this.prisma.user.update({
        where: { id: userInProcess.id },
        data: {
          verificationCode: hashedCode,
          codeExpiresAt: expiresAt,
          lastCodeSentAt: new Date(),
          registrationStep: 2, // Move to step 2 after sending code
        },
      });
    } else {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          email,
          phone,
          role: { connect: { name: RoleType.USER } },
          verificationCode: hashedCode,
          codeExpiresAt: expiresAt,
          lastCodeSentAt: new Date(),
          registrationStep: 2, // Start at step 2 after sending code
        },
      });
    }

    // Send verification code
    try {
      if (verifyEmail) {
        console.log(`🔐 [AUTH] Sending email verification code to: ${email}`);
        console.log(`🔐 [AUTH] User ID: ${user.id}`);
        await this.mailService.sendVerificationCode(email!, verificationCode);
        console.log(
          `✅ [AUTH] Email verification code sent successfully to: ${email}`
        );
      } else if (verifyPhone) {
        console.log(`📱 [AUTH] Sending SMS verification code to: ${phone}`);
        console.log(`📱 [AUTH] User ID: ${user.id}`);
        await this.smsService.sendVerificationCode(phone!, verificationCode);
        console.log(
          `✅ [AUTH] SMS verification code sent successfully to: ${phone}`
        );
      }
    } catch (error) {
      console.error(
        `❌ [AUTH] Failed to send verification code to user ${user.id}:`,
        error
      );
      console.error(`❌ [AUTH] Error details:`, error.message);
    }

    return {
      message: "Verification code sent successfully",
      step: 2, // User is now on step 2 (verification)
      method: verifyEmail ? "email" : "sms",
      userId: user.id,
    };
  }

  async verifyCode(data: VerifyCodeInput): Promise<VerifyCodeResponse> {
    const { code, userId } = data;

    // Find user by ID with verification code (step 2)
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        verificationCode: { not: null },
        codeExpiresAt: {
          gt: new Date(), // Code not expired
        },
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired verification code");
    }

    // Check if registration is already completed
    if (user.registrationStep === 5) {
      throw new ConflictException("Registration is already completed");
    }

    // Verify the code by comparing hashes
    const isCodeValid = await this.comparePasswords(
      code,
      user.verificationCode!
    );
    if (!isCodeValid) {
      throw new BadRequestException("Invalid or expired verification code");
    }

    // Update verification status
    const updateData: UserVerificationUpdateData = {
      verificationCode: null,
      codeExpiresAt: null,
      emailVerified: false,
      phoneVerified: false,
    };

    // If user has both email and phone, verify only email
    if (user.email && user.phone) {
      updateData.emailVerified = true;
    } else {
      // If user has only email or only phone, verify that one
      if (user.email) {
        updateData.emailVerified = true;
      }
      if (user.phone) {
        updateData.phoneVerified = true;
      }
    }

    // Move to step 3 (password setting)
    updateData.registrationStep = 3;

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
      include: {
        role: true,
      },
    });

    // Generate temporary token for password setting
    const payload = this.createJwtPayload(updatedUser);
    const tempToken = this.jwtService.sign(payload, { expiresIn: "10m" }); // 10 minutes

    return {
      message: "Verification successful",
      step: 3, // User is now on step 3 (password setting)
      verified: true,
      temp_token: tempToken, // Temporary token for setPassword
    };
  }

  async setPassword(
    { password, confirmPassword }: SetPasswordInput,
    userId: number
  ): Promise<SetPasswordResponse> {
    // Validate that passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    // Find user by ID who has verified email/phone but no password (step 3)
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        OR: [{ emailVerified: true }, { phoneVerified: true }],
        password: null, // No password set yet
        registrationStep: 3, // Must be on step 3 (verified but no password)
      },
    });

    if (!user) {
      throw new BadRequestException(
        "No verified user found for password setting"
      );
    }

    // Check if registration is already completed
    if (user.registrationStep === 5) {
      throw new ConflictException("Registration is already completed");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Update user with password and move to step 4
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        registrationStep: 4,
      },
      include: {
        role: true,
      },
    });

    // Generate tokens
    const payload = this.createJwtPayload(updatedUser);
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(updatedUser.id);

    return {
      message: "Password set successfully",
      step: 3,
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    };
  }

  async setPersonalInfo(
    { firstName, lastName }: SetPersonalInfoInput,
    userId: number
  ): Promise<SetPersonalInfoResponse> {
    // Find user by ID who has verified email/phone and password but no personal info (step 4)
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        password: { not: null },
        firstName: null,
        lastName: null,
      },
    });

    if (!user) {
      throw new BadRequestException("No user found for personal info setting");
    }

    // Update user with personal info and complete registration (step 5)
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        registrationStep: 5,
      },
    });

    return {
      message: "Personal information set successfully",
      step: 5,
      completed: true,
    };
  }

  async resendCode(input: ResendCodeInput): Promise<ResendCodeResponse> {
    const { userId } = input;

    // Find user by ID who needs code resend (step 2 - not verified)
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException("No user found for code resend");
    }

    // Check if registration is already completed
    if (user.registrationStep === 5) {
      throw new ConflictException("Registration is already completed");
    }

    // Check if enough time has passed since last code sent
    const now = new Date();
    const lastSent = user.lastCodeSentAt;
    const timeSinceLastSent = lastSent
      ? now.getTime() - lastSent.getTime()
      : Infinity;

    // Email: 20 seconds, SMS: 5 minutes
    // If user has both email and phone, use email interval
    const minInterval =
      (user.email && user.phone) || user.email ? 20 * 1000 : 5 * 60 * 1000;

    if (timeSinceLastSent < minInterval) {
      const canResendAt = new Date(lastSent!.getTime() + minInterval);
      return {
        message: "Please wait before requesting another code",
        canResendAt,
      };
    }

    // Generate new verification code
    const verificationCode = this.generateVerificationCode();
    const hashedCode = await this.hashPassword(verificationCode);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 20);

    // Update user with new code
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: hashedCode,
        codeExpiresAt: expiresAt,
        lastCodeSentAt: now,
      },
    });

    // Send verification code
    try {
      // If user has both email and phone, send to email
      if (user.email && user.phone) {
        await this.mailService.sendVerificationCode(
          user.email,
          verificationCode
        );
      } else if (user.email) {
        await this.mailService.sendVerificationCode(
          user.email,
          verificationCode
        );
      } else if (user.phone) {
        await this.smsService.sendVerificationCode(
          user.phone,
          verificationCode
        );
      }
    } catch (error) {
      console.error("Failed to send verification code:", error);
    }

    return {
      message: "Verification code sent successfully",
      canResendAt: new Date(now.getTime() + minInterval),
    };
  }

  async goBackStep(input: GoBackStepInput): Promise<MessageResponse> {
    const { userId } = input;

    // Find user by ID in registration process
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException("No user in registration process found");
    }

    // Check if registration is already completed
    if (user.registrationStep === 5) {
      throw new ConflictException("Registration is already completed");
    }

    // Block going back after password is set (step 3 and above)
    if (user.registrationStep >= 3) {
      throw new BadRequestException(
        "Cannot go back after password is set. Password verification is required for security."
      );
    }

    // Determine current step and what to clear
    const updateData: UserGoBackUpdateData = {};
    let message = "";

    // Check current step and go back (only for steps 1-2)
    if (user.registrationStep === 2) {
      // Step 2 -> Step 1: Clear verification status
      updateData.emailVerified = false;
      updateData.phoneVerified = false;
      updateData.verificationCode = null;
      updateData.codeExpiresAt = null;
      updateData.registrationStep = 1;
      message = "Verification cleared, back to initial step";
    } else {
      // Step 1: Can't go back further
      throw new BadRequestException("Already at the first step");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return { message };
  }
}
