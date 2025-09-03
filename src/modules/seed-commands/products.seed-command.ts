import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../../prisma/prisma.service";
import { ProductType } from "@prisma/client";
import { PRODUCT_IDS, BRAND_IDS } from "./seed-constants";

const commandName = "products";

@Command({
  name: commandName,
})
export class ProductsSeedCommand extends CommandRunner {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    console.warn(`🔄 Processing ${commandName}...`);

    const transaction = options?.transaction || this.prisma;

    const productsData = [
      {
        id: PRODUCT_IDS.RL_1,
        type: ProductType.CARTRIDGE,
        name: "1RL",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RL_3,
        type: ProductType.CARTRIDGE,
        name: "3RL",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RL_5,
        type: ProductType.CARTRIDGE,
        name: "5RL",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RL_7,
        type: ProductType.CARTRIDGE,
        name: "7RL",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RL_9,
        type: ProductType.CARTRIDGE,
        name: "9Rl",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RL_11,
        type: ProductType.CARTRIDGE,
        name: "11RL",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RL_14,
        type: ProductType.CARTRIDGE,
        name: "14RL",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RS_3,
        type: ProductType.CARTRIDGE,
        name: "3RS",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RS_5,
        type: ProductType.CARTRIDGE,
        name: "5RS",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RS_7,
        type: ProductType.CARTRIDGE,
        name: "7RS",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RS_9,
        type: ProductType.CARTRIDGE,
        name: "9RS",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RS_11,
        type: ProductType.CARTRIDGE,
        name: "11RS",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RS_14,
        type: ProductType.CARTRIDGE,
        name: "14RS",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RS_9_AB,
        type: ProductType.CARTRIDGE,
        name: "9RS_AB",
        brandId: BRAND_IDS.AB,
      },
      {
        id: PRODUCT_IDS.RM_5,
        type: ProductType.CARTRIDGE,
        name: "5RM",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RM_7,
        type: ProductType.CARTRIDGE,
        name: "7RM",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RM_9,
        type: ProductType.CARTRIDGE,
        name: "9RM",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RM_11,
        type: ProductType.CARTRIDGE,
        name: "11RM",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RM_13,
        type: ProductType.CARTRIDGE,
        name: "13RM",
        brandId: BRAND_IDS.AB,
      },
      {
        id: PRODUCT_IDS.RM_15,
        type: ProductType.CARTRIDGE,
        name: "15RM",
        brandId: BRAND_IDS.AB,
      },
      {
        id: PRODUCT_IDS.RM_17,
        type: ProductType.CARTRIDGE,
        name: "17RM",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.RM_35,
        type: ProductType.CARTRIDGE,
        name: "35RM",
        brandId: BRAND_IDS.AB,
      },
      {
        id: PRODUCT_IDS.M1_5,
        type: ProductType.CARTRIDGE,
        name: "5M1",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.M1_7,
        type: ProductType.CARTRIDGE,
        name: "7M1",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.M1_9,
        type: ProductType.CARTRIDGE,
        name: "9M1",
        brandId: BRAND_IDS.YELLOW_DRAGONFLY,
      },
      {
        id: PRODUCT_IDS.BOX,
        type: ProductType.CARTRIDGE,
        name: "box",
        brandId: BRAND_IDS.POSEIDON,
      },
      {
        id: PRODUCT_IDS.DYNAMIC_RL_3,
        type: ProductType.CARTRIDGE,
        name: "3RL_Dynamic",
        brandId: BRAND_IDS.DYNAMIC,
      },
      {
        id: PRODUCT_IDS.DYNAMIC_RL_5,
        type: ProductType.CARTRIDGE,
        name: "5RL_Dynamic",
        brandId: BRAND_IDS.DYNAMIC,
      },
      {
        id: PRODUCT_IDS.DYNAMIC_RL_7,
        type: ProductType.CARTRIDGE,
        name: "7RL_Dynamic",
        brandId: BRAND_IDS.DYNAMIC,
      },
      {
        id: PRODUCT_IDS.DYNAMIC_RL_9,
        type: ProductType.CARTRIDGE,
        name: "9Rl_Dynamic",
        brandId: BRAND_IDS.DYNAMIC,
      },
      {
        id: PRODUCT_IDS.DYNAMIC_RL_11,
        type: ProductType.CARTRIDGE,
        name: "11RL_Dynamic",
        brandId: BRAND_IDS.DYNAMIC,
      },
      {
        id: PRODUCT_IDS.BLACK_PAINT,
        type: ProductType.PAINT,
        name: "black paint",
        brandId: BRAND_IDS.POSEIDON,
      },
      {
        id: PRODUCT_IDS.TRANSFER_GEL,
        type: ProductType.GEL,
        name: "transfer gel",
        brandId: BRAND_IDS.STENCIL_STUFF,
      },
      {
        id: PRODUCT_IDS.RM_39,
        type: ProductType.CARTRIDGE,
        name: "39RM",
        brandId: BRAND_IDS.AB,
      },
      {
        id: PRODUCT_IDS.RM_45,
        type: ProductType.CARTRIDGE,
        name: "45RM",
        brandId: BRAND_IDS.AB,
      },
      {
        id: PRODUCT_IDS.RS_5_AB,
        type: ProductType.CARTRIDGE,
        name: "5RS_AB",
        brandId: BRAND_IDS.AB,
      },
    ];

    // Get all product IDs that should exist
    const expectedProductIds = productsData.map((product) => product.id);

    // Delete products that are not in the expected list
    const deleteResult = await transaction.product.deleteMany({
      where: {
        id: {
          notIn: expectedProductIds,
        },
      },
    });

    console.log(`${deleteResult.count} products deleted`);

    // Upsert each product (create or update)
    let createdCount = 0;
    let updatedCount = 0;

    for (const productData of productsData) {
      const existingProduct = await transaction.product.findUnique({
        where: { id: productData.id },
      });

      if (existingProduct) {
        await transaction.product.update({
          where: { id: productData.id },
          data: productData,
        });
        updatedCount++;
      } else {
        await transaction.product.create({
          data: productData,
        });
        createdCount++;
      }
    }

    console.log(
      `${createdCount} products created, ${updatedCount} products updated`
    );
    console.warn(`✅ Done ${commandName}`);
  }
}
