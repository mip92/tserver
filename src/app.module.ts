import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./modules/users/user.module";
import { RoleModule } from "./modules/roles/role.module";
import { AuthModule } from "./modules/auth/auth.module";
import configuration from "./config/configuration";
import { GraphQLAuthMiddleware } from "./modules/auth/graphql-auth.middleware";

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
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GraphQLAuthMiddleware)
      .forRoutes({ path: "graphql", method: RequestMethod.POST });
  }
}
