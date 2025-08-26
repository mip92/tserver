import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GraphQLAuthGuard } from "./guards/graphql-auth.guard";
import { LoginInput, RefreshTokenInput, AuthResponse } from "./auth.model";

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
}
