import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../../prisma/prisma.service";
import {
  FileStorageService,
  FileEntityType,
} from "../file-storage/file-storage.service";
import { readFileSync } from "fs";
import { join } from "path";
import {
  PrismaTransactionClient,
  FILE_IDS,
  PRODUCT_IDS,
} from "./seed-constants";

const commandName = "files";

@Command({
  name: commandName,
})
export class FilesSeedCommand extends CommandRunner {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorageService: FileStorageService
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    console.warn(`🔄 Processing ${commandName}...`);
    const createdItemsUniqIdentifiers = [];

    const transaction: PrismaTransactionClient =
      options?.transaction || this.prisma;

    // Create files with hardcoded IDs and upload to S3
    const filesToCreate = [
      // RL_3 files
      {
        id: FILE_IDS.RL_3_MAIN,
        filename: "3rl-main.svg",
        type: "MAIN" as const,
        order: 1,
        productId: PRODUCT_IDS.RL_3,
        productType: "cartridge",
      },
      {
        id: FILE_IDS.RL_3_GALLERY_1,
        filename: "3rl-gallery-1.svg",
        type: "GALLERY" as const,
        order: 2,
        productId: PRODUCT_IDS.RL_3,
        productType: "cartridge",
      },
      {
        id: FILE_IDS.RL_3_GALLERY_2,
        filename: "3rl-gallery-2.svg",
        type: "GALLERY" as const,
        order: 3,
        productId: PRODUCT_IDS.RL_3,
        productType: "cartridge",
      },
      {
        id: FILE_IDS.RL_3_THUMBNAIL,
        filename: "3rl-thumb.svg",
        type: "THUMBNAIL" as const,
        order: 0,
        productId: PRODUCT_IDS.RL_3,
        productType: "cartridge",
      },
      // RL_5 files
      {
        id: FILE_IDS.RL_5_MAIN,
        filename: "5rl-main.svg",
        type: "MAIN" as const,
        order: 1,
        productId: PRODUCT_IDS.RL_5,
        productType: "cartridge",
      },
      {
        id: FILE_IDS.RL_5_GALLERY_1,
        filename: "5rl-gallery-1.svg",
        type: "GALLERY" as const,
        order: 2,
        productId: PRODUCT_IDS.RL_5,
        productType: "cartridge",
      },
      {
        id: FILE_IDS.RL_5_GALLERY_2,
        filename: "5rl-gallery-2.svg",
        type: "GALLERY" as const,
        order: 3,
        productId: PRODUCT_IDS.RL_5,
        productType: "cartridge",
      },
      {
        id: FILE_IDS.RL_5_THUMBNAIL,
        filename: "5rl-thumb.svg",
        type: "THUMBNAIL" as const,
        order: 0,
        productId: PRODUCT_IDS.RL_5,
        productType: "cartridge",
      },
      // BLACK_PAINT files
      {
        id: FILE_IDS.BLACK_PAINT_MAIN,
        filename: "black-paint-main.svg",
        type: "MAIN" as const,
        order: 1,
        productId: PRODUCT_IDS.BLACK_PAINT,
        productType: "paint",
      },
      {
        id: FILE_IDS.BLACK_PAINT_GALLERY_1,
        filename: "black-paint-gallery-1.svg",
        type: "GALLERY" as const,
        order: 2,
        productId: PRODUCT_IDS.BLACK_PAINT,
        productType: "paint",
      },
      {
        id: FILE_IDS.BLACK_PAINT_GALLERY_2,
        filename: "black-paint-gallery-2.svg",
        type: "GALLERY" as const,
        order: 3,
        productId: PRODUCT_IDS.BLACK_PAINT,
        productType: "paint",
      },
      {
        id: FILE_IDS.BLACK_PAINT_THUMBNAIL,
        filename: "black-paint-thumb.svg",
        type: "THUMBNAIL" as const,
        order: 0,
        productId: PRODUCT_IDS.BLACK_PAINT,
        productType: "paint",
      },
      // TRANSFER_GEL files
      {
        id: FILE_IDS.TRANSFER_GEL_MAIN,
        filename: "transfer-gel-main.svg",
        type: "MAIN" as const,
        order: 1,
        productId: PRODUCT_IDS.TRANSFER_GEL,
        productType: "gel",
      },
      {
        id: FILE_IDS.TRANSFER_GEL_GALLERY_1,
        filename: "transfer-gel-gallery-1.svg",
        type: "GALLERY" as const,
        order: 2,
        productId: PRODUCT_IDS.TRANSFER_GEL,
        productType: "gel",
      },
      {
        id: FILE_IDS.TRANSFER_GEL_GALLERY_2,
        filename: "transfer-gel-gallery-2.svg",
        type: "GALLERY" as const,
        order: 3,
        productId: PRODUCT_IDS.TRANSFER_GEL,
        productType: "gel",
      },
      {
        id: FILE_IDS.TRANSFER_GEL_THUMBNAIL,
        filename: "transfer-gel-thumb.svg",
        type: "THUMBNAIL" as const,
        order: 0,
        productId: PRODUCT_IDS.TRANSFER_GEL,
        productType: "gel",
      },
    ];

    // Get all file IDs that should exist
    const expectedFileIds = filesToCreate.map((file) => file.id);

    // Get files that will be deleted to remove them from S3
    const filesToDelete = await transaction.file.findMany({
      where: {
        id: {
          notIn: expectedFileIds,
        },
      },
    });

    // Delete files from S3 first
    for (const fileToDelete of filesToDelete) {
      try {
        console.log(`🗑️ Deleting from S3: ${fileToDelete.s3Key}`);
        await this.fileStorageService.deleteFile(fileToDelete.s3Key);
        console.log(`✅ S3 deletion successful: ${fileToDelete.s3Key}`);
      } catch (error) {
        console.error(
          `❌ Failed to delete from S3: ${fileToDelete.s3Key}`,
          error.message
        );
        throw new Error(
          `S3 deletion failed for ${fileToDelete.s3Key}: ${error.message}`
        );
      }
    }

    // Delete files from database
    const deleteResult = await transaction.file.deleteMany({
      where: {
        id: {
          notIn: expectedFileIds,
        },
      },
    });

    console.log(`${deleteResult.count} files deleted from database`);

    let createdCount = 0;
    let updatedCount = 0;
    for (const fileData of filesToCreate) {
      try {
        console.log(`📤 Uploading ${fileData.filename} to S3...`);

        // Upload file to S3
        const uploadResult = await this.uploadProductImage(
          fileData.filename.replace(".svg", ""),
          fileData.productId.toString(),
          this.getSubfolderByType(fileData.type),
          fileData.productType
        );

        console.log(`✅ S3 upload successful: ${uploadResult.key}`);

        // Check if file already exists in database
        const existingFile = await transaction.file.findUnique({
          where: { id: fileData.id },
        });

        const fileRecord = {
          id: fileData.id,
          filename: fileData.filename,
          s3Key: uploadResult.key,
          type: fileData.type,
          order: fileData.order,
          productId: fileData.productId,
        };

        if (existingFile) {
          // Update existing file
          await transaction.file.update({
            where: { id: fileData.id },
            data: fileRecord,
          });
          updatedCount++;
          console.log(`📝 Database record updated: ${fileData.filename}`);
        } else {
          // Create new file
          await transaction.file.create({
            data: fileRecord,
          });
          createdCount++;
          console.log(`📝 Database record created: ${fileData.filename}`);
        }
      } catch (error) {
        console.error(
          `❌ Failed to process ${fileData.filename}:`,
          error.message
        );
        throw new Error(
          `File upload failed for ${fileData.filename}: ${error.message}`
        );
      }
    }

    console.log(`${createdCount} files created, ${updatedCount} files updated`);
    console.warn(`✅ Done ${commandName}`);
  }

  private async uploadProductImage(
    baseName: string,
    productId: string,
    subfolder: string,
    productType: string
  ) {
    // Determine which SVG to use based on product type
    const svgFile = this.getSvgForProductType(productType);
    const filePath = join(process.cwd(), "public/images/products", svgFile);

    const fileContent = readFileSync(filePath);

    // Create a mock Multer file object
    const mockFile = {
      fieldname: "file",
      originalname: `${baseName}.svg`,
      encoding: "7bit",
      mimetype: "image/svg+xml",
      size: fileContent.length,
      buffer: fileContent,
      stream: null,
      destination: "",
      filename: `${baseName}.svg`,
      path: filePath,
    } as Express.Multer.File;

    return await this.fileStorageService.uploadFile(
      mockFile,
      FileEntityType.PRODUCT,
      productId,
      subfolder
    );
  }

  private getSvgForProductType(productType: string): string {
    switch (productType) {
      case "cartridge":
        return "cartridge-main.svg";
      case "paint":
        return "paint-main.svg";
      case "gel":
        return "gel-main.svg";
      default:
        return "cartridge-main.svg";
    }
  }

  private getSubfolderByType(fileType: string): string {
    switch (fileType) {
      case "MAIN":
        return "main";
      case "GALLERY":
        return "gallery";
      case "THUMBNAIL":
        return "thumbnails";
      default:
        return "main";
    }
  }
}
