import { PrismaClient } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { PRODUCT_IDS, BRAND_IDS, PrismaTransactionClient } from "./constants";

export async function seedProducts(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Products");

  const productsData = [
    {
      id: PRODUCT_IDS.RL_1,
      type: "Cartridge",
      name: "1RL",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RL_3,
      type: "Cartridge",
      name: "3RL",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RL_5,
      type: "Cartridge",
      name: "5RL",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RL_7,
      type: "Cartridge",
      name: "7RL",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RL_9,
      type: "Cartridge",
      name: "9Rl",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RL_11,
      type: "Cartridge",
      name: "11RL",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RL_14,
      type: "Cartridge",
      name: "14RL",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RS_3,
      type: "Cartridge",
      name: "3RS",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RS_5,
      type: "Cartridge",
      name: "5RS",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RS_7,
      type: "Cartridge",
      name: "7RS",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RS_9,
      type: "Cartridge",
      name: "9RS",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RS_11,
      type: "Cartridge",
      name: "11RS",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RS_14,
      type: "Cartridge",
      name: "14RS",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RS_9_AB,
      type: "Cartridge",
      name: "9RS_AB",
      brandId: BRAND_IDS.AB,
    },
    {
      id: PRODUCT_IDS.RM_5,
      type: "Cartridge",
      name: "5RM",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RM_7,
      type: "Cartridge",
      name: "7RM",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RM_9,
      type: "Cartridge",
      name: "9RM",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RM_11,
      type: "Cartridge",
      name: "11RM",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RM_13,
      type: "Cartridge",
      name: "13RM",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RM_15,
      type: "Cartridge",
      name: "15RM",
      brandId: BRAND_IDS.AB,
    },
    {
      id: PRODUCT_IDS.RM_17,
      type: "Cartridge",
      name: "17RM",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.RM_35,
      type: "Cartridge",
      name: "35RM",
      brandId: BRAND_IDS.AB,
    },
    {
      id: PRODUCT_IDS.M1_5,
      type: "Cartridge",
      name: "5M1",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.M1_7,
      type: "Cartridge",
      name: "7M1",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.M1_9,
      type: "Cartridge",
      name: "9M1",
      brandId: BRAND_IDS.YELLOW_DRAGONFLY,
    },
    {
      id: PRODUCT_IDS.BOX,
      type: "Cartridge",
      name: "box",
      brandId: BRAND_IDS.POSEIDON,
    },
    {
      id: PRODUCT_IDS.DYNAMIC_RL_3,
      type: "Cartridge",
      name: "3RL_Dynamic",
      brandId: BRAND_IDS.DYNAMIC,
    },
    {
      id: PRODUCT_IDS.DYNAMIC_RL_5,
      type: "Cartridge",
      name: "5RL_Dynamic",
      brandId: BRAND_IDS.DYNAMIC,
    },
    {
      id: PRODUCT_IDS.DYNAMIC_RL_7,
      type: "Cartridge",
      name: "7RL_Dynamic",
      brandId: BRAND_IDS.DYNAMIC,
    },
    {
      id: PRODUCT_IDS.DYNAMIC_RL_9,
      type: "Cartridge",
      name: "9Rl_Dynamic",
      brandId: BRAND_IDS.DYNAMIC,
    },
    {
      id: PRODUCT_IDS.DYNAMIC_RL_11,
      type: "Cartridge",
      name: "11RL_Dynamic",
      brandId: BRAND_IDS.DYNAMIC,
    },
    {
      id: PRODUCT_IDS.BLACK_PAINT,
      type: "Paint",
      name: "black paint",
      brandId: BRAND_IDS.POSEIDON,
    },
    {
      id: PRODUCT_IDS.TRANSFER_GEL,
      type: "transfer gel",
      name: "transfer gel",
      brandId: BRAND_IDS.STENCIL_STUFF,
    },
    {
      id: PRODUCT_IDS.RM_39,
      type: "Cartridge",
      name: "39RM",
      brandId: BRAND_IDS.AB,
    },
    {
      id: PRODUCT_IDS.RM_45,
      type: "Cartridge",
      name: "45RM",
      brandId: BRAND_IDS.AB,
    },
    {
      id: PRODUCT_IDS.RS_5_AB,
      type: "Cartridge",
      name: "5RS_AB",
      brandId: BRAND_IDS.AB,
    },
  ];

  const products = await prisma.product.createMany({
    data: productsData,
  });

  logSuccess(`${products.count} products created successfully`);

  return products;
}
