import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductResolver } from "./product.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { FileStorageModule } from "../file-storage/file-storage.module";

@Module({
  imports: [PrismaModule, AuthModule, FileStorageModule],
  controllers: [],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
