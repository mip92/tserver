import { Module, forwardRef } from "@nestjs/common";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { TeamResolver } from "./team.resolver";
import { UserModule } from "../users/user.module";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [forwardRef(() => UserModule), PrismaModule],
  controllers: [TeamController],
  providers: [TeamService, TeamResolver],
  exports: [TeamService],
})
export class TeamModule {}
