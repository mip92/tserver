import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { FileStorageModule } from "./modules/file-storage/file-storage.module";
import { SeedCommandsModule } from "./modules/seed-commands/seed-commands.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    FileStorageModule,
    SeedCommandsModule,
  ],
})
export class CliModule {}
