import { PrismaClient } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import {
  BOX_IDS,
  PRODUCT_IDS,
  BOX_PRODUCT_IDS,
  PrismaTransactionClient,
} from "./constants";

export async function seedBoxProducts(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Box Products");

  // Массовое создание связей между коробками и продуктами
  const boxProductsData = [
    // Коробка 1 (black_RL) - картриджи RL
    {
      id: BOX_PRODUCT_IDS.RL_3_CARTRIDGES_1,
      name: "3RL Cartridges",
      quantity: 50,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RL_1,
      productId: PRODUCT_IDS.RL_3,
      purchasePrice: 250,
      status: "active",
    },
    {
      id: BOX_PRODUCT_IDS.RL_5_CARTRIDGES_1,
      name: "5RL Cartridges",
      quantity: 45,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RL_1,
      productId: PRODUCT_IDS.RL_5,
      purchasePrice: 280,
      status: "active",
    },
    {
      id: BOX_PRODUCT_IDS.RL_7_CARTRIDGES_1,
      name: "7RL Cartridges",
      quantity: 40,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RL_1,
      productId: PRODUCT_IDS.RL_7,
      purchasePrice: 300,
      status: "active",
    },

    // Коробка 2 (white_RL) - картриджи RL
    {
      id: BOX_PRODUCT_IDS.RL_9_CARTRIDGES_1,
      name: "9RL Cartridges",
      quantity: 30,
      date: new Date(),
      boxId: BOX_IDS.WHITE_RL_1,
      productId: PRODUCT_IDS.RL_9,
      purchasePrice: 320,
      status: "active",
    },
    {
      id: BOX_PRODUCT_IDS.RL_11_CARTRIDGES_1,
      name: "11RL Cartridges",
      quantity: 25,
      date: new Date(),
      boxId: BOX_IDS.WHITE_RL_1,
      productId: PRODUCT_IDS.RL_11,
      purchasePrice: 350,
      status: "active",
    },

    // Коробка 3 (black_RL) - дополнительные RL
    {
      id: BOX_PRODUCT_IDS.RL_14_CARTRIDGES_1,
      name: "14RL Cartridges",
      quantity: 35,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RL_2,
      productId: PRODUCT_IDS.RL_14,
      purchasePrice: 320,
      status: "active",
    },

    // Коробка 4 (black_RS) - картриджи RS
    {
      id: BOX_PRODUCT_IDS.RS_3_CARTRIDGES_1,
      name: "3RS Cartridges",
      quantity: 40,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RS_1,
      productId: PRODUCT_IDS.RS_3,
      purchasePrice: 260,
      status: "active",
    },
    {
      id: BOX_PRODUCT_IDS.RS_5_CARTRIDGES_1,
      name: "5RS Cartridges",
      quantity: 35,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RS_1,
      productId: PRODUCT_IDS.RS_5,
      purchasePrice: 290,
      status: "active",
    },

    // Коробка 5 (black_RS) - дополнительные RS
    {
      id: BOX_PRODUCT_IDS.RS_7_CARTRIDGES_1,
      name: "7RS Cartridges",
      quantity: 30,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RS_2,
      productId: PRODUCT_IDS.RS_7,
      purchasePrice: 320,
      status: "active",
    },
    {
      id: BOX_PRODUCT_IDS.RS_9_CARTRIDGES_1,
      name: "9RS Cartridges",
      quantity: 25,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RS_2,
      productId: PRODUCT_IDS.RS_9,
      purchasePrice: 350,
      status: "active",
    },

    // Коробка 6 (black_RM) - картриджи RM
    {
      id: BOX_PRODUCT_IDS.RM_5_CARTRIDGES_1,
      name: "5RM Cartridges",
      quantity: 30,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RM_1,
      productId: PRODUCT_IDS.RM_5,
      purchasePrice: 280,
      status: "active",
    },
    {
      id: BOX_PRODUCT_IDS.RM_7_CARTRIDGES_1,
      name: "7RM Cartridges",
      quantity: 25,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RM_1,
      productId: PRODUCT_IDS.RM_7,
      purchasePrice: 310,
      status: "active",
    },

    // Коробка 7 (black_RM) - дополнительные RM
    {
      id: BOX_PRODUCT_IDS.RM_9_CARTRIDGES_1,
      name: "9RM Cartridges",
      quantity: 20,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RM_2,
      productId: PRODUCT_IDS.RM_9,
      purchasePrice: 340,
      status: "active",
    },
    {
      id: BOX_PRODUCT_IDS.RM_11_CARTRIDGES_1,
      name: "11RM Cartridges",
      quantity: 18,
      date: new Date(),
      boxId: BOX_IDS.BLACK_RM_2,
      productId: PRODUCT_IDS.RM_11,
      purchasePrice: 370,
      status: "active",
    },

    // Коробка 8 (black_M1) - картриджи M1
    {
      id: BOX_PRODUCT_IDS.M1_5_CARTRIDGES_1,
      name: "5M1 Cartridges",
      quantity: 25,
      date: new Date(),
      boxId: BOX_IDS.BLACK_M1_1,
      productId: PRODUCT_IDS.M1_5,
      purchasePrice: 300,
      status: "active",
    },
    {
      id: BOX_PRODUCT_IDS.M1_7_CARTRIDGES_1,
      name: "7M1 Cartridges",
      quantity: 20,
      date: new Date(),
      boxId: BOX_IDS.BLACK_M1_1,
      productId: PRODUCT_IDS.M1_7,
      purchasePrice: 330,
      status: "active",
    },

    // Коробка 9 (white_M1) - картриджи M1
    {
      id: BOX_PRODUCT_IDS.M1_9_CARTRIDGES_1,
      name: "9M1 White Cartridges",
      quantity: 15,
      date: new Date(),
      boxId: BOX_IDS.WHITE_M1_1,
      productId: PRODUCT_IDS.M1_9,
      purchasePrice: 360,
      status: "active",
    },

    // Коробка 10 (dark_blue_box) - краски и гели
    {
      id: BOX_PRODUCT_IDS.BOX_1,
      name: "Box Product",
      quantity: 15,
      date: new Date(),
      boxId: BOX_IDS.DARK_BLUE_BOX_1,
      productId: PRODUCT_IDS.BOX,
      purchasePrice: 200,
      status: "active",
    },
  ];

  const boxProducts = await prisma.boxProduct.createMany({
    data: boxProductsData,
  });

  logSuccess(`${boxProducts.count} box products created successfully`);

  return boxProducts;
}
