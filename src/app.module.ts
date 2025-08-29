import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./modules/users/user.module";
import { RoleModule } from "./modules/roles/role.module";
import { AuthModule } from "./modules/auth/auth.module";
import configuration from "./config/configuration";
import { ProductModule } from "./modules/products/product.module";
import { BrandModule } from "./modules/brands/brand.module";
import { BoxTypeModule } from "./modules/box-types/box-type.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
    }),
    PrismaModule,
    UserModule,
    RoleModule,
    AuthModule,
    ProductModule,
    BrandModule,
    BoxTypeModule,
    HealthModule,
  ],
})
export class AppModule {}
