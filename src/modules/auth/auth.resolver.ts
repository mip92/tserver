import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GraphQLAuthGuard } from "./guards/graphql-auth.guard";
import { TempTokenGuard } from "./guards/temp-token.guard";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import {
  RefreshToken,
  RefreshTokenData,
} from "./decorators/refresh-token.decorator";
import { LogoutToken } from "./decorators/logout-token.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";
import { CurrentUser as CurrentUserType } from "./types/user.types";
import {
  LoginInput,
  AuthResponse,
  ForgotPasswordInput,
  MessageResponse,
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
  UserProfile,
  UserAuth,
} from "./auth.model";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args("input") input: LoginInput) {
    const user = await this.authService.validateUser(
      input.email,
      input.phone,
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
  @Query(() => UserAuth)
  getProfile(@CurrentUser() user: CurrentUserType) {
    return user;
  }

  @Mutation(() => MessageResponse)
  async forgotPassword(@Args("input") input: ForgotPasswordInput) {
    return this.authService.forgotPassword(input);
  }

  // Multi-step registration mutations

  @Mutation(() => StartRegistrationResponse)
  async startRegistration(@Args("input") input: StartRegistrationInput) {
    console.log("input", input);
    return this.authService.startRegistration(input);
  }

  @Mutation(() => VerifyCodeResponse)
  async verifyCode(@Args("input") input: VerifyCodeInput) {
    return this.authService.verifyCode(input);
  }

  @Mutation(() => SetPasswordResponse)
  @UseGuards(TempTokenGuard)
  async setPassword(
    @Args("input") input: SetPasswordInput,
    @CurrentUser() user: CurrentUserType
  ) {
    return this.authService.setPassword(input, user.id);
  }

  @Mutation(() => SetPersonalInfoResponse)
  @UseGuards(GraphQLAuthGuard)
  async setPersonalInfo(
    @Args("input") input: SetPersonalInfoInput,
    @CurrentUser() user: CurrentUserType
  ) {
    return this.authService.setPersonalInfo(input, user.id);
  }

  @Mutation(() => ResendCodeResponse)
  async resendCode(@Args("input") input: ResendCodeInput) {
    return this.authService.resendCode(input);
  }

  @Mutation(() => MessageResponse)
  async goBackStep(@Args("input") input: GoBackStepInput) {
    return this.authService.goBackStep(input);
  }
}
