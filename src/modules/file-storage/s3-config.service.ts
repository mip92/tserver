import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";

@Injectable()
export class S3ConfigService {
  public readonly s3Client: S3Client;
  public readonly bucketName: string;
  public readonly publicDomain: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>("S3_BUCKET_NAME");
    this.publicDomain =
      this.configService.getOrThrow<string>("S3_PUBLIC_DOMAIN");

    this.s3Client = new S3Client({
      region: "auto",
      endpoint: this.configService.getOrThrow<string>("S3_ENDPOINT"),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>("S3_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.getOrThrow<string>(
          "S3_SECRET_ACCESS_KEY"
        ),
      },
    });
  }
}
