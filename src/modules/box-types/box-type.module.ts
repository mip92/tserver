import { Module } from "@nestjs/common";
import { BoxTypeResolver } from "./box-type.resolver";
import { BoxTypeService } from "./box-type.service";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [BoxTypeResolver, BoxTypeService],
  exports: [BoxTypeService],
})
export class BoxTypeModule {}
