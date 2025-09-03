import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FileStorageModule } from "../file-storage/file-storage.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { RolesSeedCommand } from "./roles.seed-command";
import { UsersSeedCommand } from "./users.seed-command";
import { BrandsSeedCommand } from "./brands.seed-command";
import { BoxTypesSeedCommand } from "./box-types.seed-command";
import { ProductsSeedCommand } from "./products.seed-command";
import { BoxesSeedCommand } from "./boxes.seed-command";
import { InventoryItemsSeedCommand } from "./inventory-items.seed-command";
import { FilesSeedCommand } from "./files.seed-command";
import { AllSeedCommand } from "./all.seed-command";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FileStorageModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [
    RolesSeedCommand,
    UsersSeedCommand,
    BrandsSeedCommand,
    BoxTypesSeedCommand,
    ProductsSeedCommand,
    BoxesSeedCommand,
    InventoryItemsSeedCommand,
    FilesSeedCommand,
    AllSeedCommand,
  ],
  exports: [
    RolesSeedCommand,
    UsersSeedCommand,
    BrandsSeedCommand,
    BoxTypesSeedCommand,
    ProductsSeedCommand,
    BoxesSeedCommand,
    InventoryItemsSeedCommand,
    FilesSeedCommand,
    AllSeedCommand,
  ],
})
export class SeedCommandsModule {}
