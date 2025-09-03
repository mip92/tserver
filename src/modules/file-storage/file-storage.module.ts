import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FileStorageService } from "./file-storage.service";
import { S3ConfigService } from "./s3-config.service";

@Module({
  imports: [ConfigModule],
  providers: [FileStorageService, S3ConfigService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
