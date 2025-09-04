import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { RolesGuard } from "./guards/admin-role.guard";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";
import { PrismaModule } from "../../prisma/prisma.module";
import { UserModule } from "../users/user.module";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        // Use JWT secret
        const secret = configService.getOrThrow<string>("JWT_SECRET");

        return {
          secret: secret,
          signOptions: {
            expiresIn: configService.getOrThrow<string>(
              "JWT_ACCESS_TOKEN_EXPIRES_IN"
            ),
            algorithm: "HS256",
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    LocalStrategy,
    RolesGuard,
    RefreshTokenGuard,
  ],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
