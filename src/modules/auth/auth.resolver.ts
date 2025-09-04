import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GraphQLAuthGuard } from "./guards/graphql-auth.guard";
import { ResetTokenGuard } from "./guards/reset-token.guard";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { ResetToken, ResetTokenData } from "./decorators/reset-token.decorator";
import {
  RefreshToken,
  RefreshTokenData,
} from "./decorators/refresh-token.decorator";
import { LogoutToken } from "./decorators/logout-token.decorator";
import {
  LoginInput,
  AuthResponse,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  MessageResponse,
} from "./auth.model";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args("input") input: LoginInput) {
    const user = await this.authService.validateUser(
      input.email,
      input.password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    return this.authService.login(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => AuthResponse)
  async refreshToken(@RefreshToken() refreshTokenData: RefreshTokenData) {
    return this.authService.refreshToken(refreshTokenData);
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => String)
  async logout(@LogoutToken() refreshToken: string) {
    await this.authService.logout(refreshToken);
    return "Successfully logged out";
  }

  @UseGuards(GraphQLAuthGuard)
  @Query(() => String)
  getProfile() {
    return "Profile data";
  }

  @Mutation(() => AuthResponse)
  async register(@Args("input") input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => MessageResponse)
  async forgotPassword(@Args("input") input: ForgotPasswordInput) {
    return this.authService.forgotPassword(input.email);
  }

  @UseGuards(ResetTokenGuard)
  @Mutation(() => AuthResponse)
  async resetPassword(
    @Args("input") input: ResetPasswordInput,
    @ResetToken() resetTokenData: ResetTokenData
  ) {
    return this.authService.resetPassword(
      resetTokenData.token.token,
      input.newPassword,
      resetTokenData.user.id
    );
  }
}
