import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { TeamModule } from "../teams/team.module";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [forwardRef(() => TeamModule), PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
