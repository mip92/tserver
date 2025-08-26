import { Controller, Post, Body, UseGuards, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { Token } from "./decorators/token.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    return this.authService.login(user);
  }

  @Post("refresh")
  async refresh(@Token() token: string) {
    if (!token) {
      throw new Error("Invalid authorization header");
    }

    return this.authService.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Token() token: string) {
    if (!token) {
      throw new Error("Invalid authorization header");
    }

    return this.authService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
