import { Injectable, BadRequestException } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3ConfigService } from "./s3-config.service";

export enum FileEntityType {
  PRODUCT = "products",
  BOX = "boxes",
  BRAND = "brands",
  USER = "users",
}

export interface UploadResult {
  url: string;
  key: string;
  publicUrl: string;
}

@Injectable()
export class FileStorageService {
  constructor(private s3Config: S3ConfigService) {}

  async uploadFile(
    file: Express.Multer.File,
    entityType: FileEntityType,
    entityId: string,
    subfolder?: string
  ): Promise<UploadResult> {
    this.validateFile(file);

    const fileExtension = this.getFileExtension(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;

    const folderPath = subfolder
      ? `${entityType}/${entityId}/${subfolder}`
      : `${entityType}/${entityId}`;

    const key = `${folderPath}/${fileName}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.s3Config.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Config.s3Client.send(command);

      const publicUrl = `https://${this.s3Config.publicDomain}/${key}`;
      const signedUrl = await getSignedUrl(this.s3Config.s3Client, command, {
        expiresIn: 3600,
      });

      return {
        url: signedUrl,
        key,
        publicUrl,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.s3Config.bucketName,
      Key: key,
    });

    try {
      await this.s3Config.s3Client.send(command);
    } catch (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  async getPublicUrl(key: string): Promise<string> {
    return `https://${this.s3Config.publicDomain}/${key}`;
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.s3Config.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.s3Config.s3Client, command, { expiresIn });
  }

  private validateFile(file: Express.Multer.File): void {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG images are allowed."
      );
    }

    if (file.size > maxSize) {
      throw new BadRequestException("File size exceeds 10MB limit.");
    }
  }

  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf(".");
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";
  }
}
