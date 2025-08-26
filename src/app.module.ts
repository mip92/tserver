import { Module } from "@nestjs/common";
import { UserModule } from "./modules/users/user.module";
import { TeamModule } from "./modules/teams/team.module";
import { GraphQLModule } from "@nestjs/graphql";
import { PrismaModule } from "./prisma/prisma.module";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      introspection: true,
      // playground больше не поддерживается в Apollo Server 4
      // вместо него используется Apollo Studio Explorer
    }),
    UserModule,
    TeamModule,
  ],
})
export class AppModule {}
