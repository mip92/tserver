import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GraphQLAuthGuard } from "./guards/graphql-auth.guard";
import {
  LoginInput,
  RefreshTokenInput,
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

  @Mutation(() => AuthResponse)
  async refreshToken(@Args("input") input: RefreshTokenInput) {
    return this.authService.refreshToken(input.refreshToken);
  }

  @UseGuards(GraphQLAuthGuard)
  @Mutation(() => String)
  async logout(@Args("refreshToken") refreshToken: string) {
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

  @Mutation(() => MessageResponse)
  async resetPassword(@Args("input") input: ResetPasswordInput) {
    return this.authService.resetPassword(input.token, input.newPassword);
  }
}
