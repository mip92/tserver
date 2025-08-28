import { PrismaClient, Prisma } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import {
  INVENTORY_ITEM_IDS,
  BOX_IDS,
  PRODUCT_IDS,
  PrismaTransactionClient,
} from "./constants";

export async function seedInventoryItems(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Inventory Items");
  const inventoryItemsData: Prisma.Enumerable<Prisma.InventoryItemCreateManyInput> =
    [
      {
        id: INVENTORY_ITEM_IDS.RL_3_CARTRIDGES_1,
        name: "3RL Cartridges",
        quantity: 50,
        date: new Date(),
        boxId: BOX_IDS.BLACK_RL_1,
        productId: PRODUCT_IDS.RL_3,
        purchasePrice: 250,
        status: "active",
      },
      {
        id: INVENTORY_ITEM_IDS.RL_5_CARTRIDGES_1,
        name: "5RL Cartridges",
        quantity: 45,
        date: new Date(),
        boxId: BOX_IDS.BLACK_RL_1,
        productId: PRODUCT_IDS.RL_5,
        purchasePrice: 280,
        status: "active",
      },
      {
        id: INVENTORY_ITEM_IDS.RL_7_CARTRIDGES_1,
        name: "7RL Cartridges",
        quantity: 40,
        date: new Date(),
        boxId: BOX_IDS.BLACK_RL_1,
        productId: PRODUCT_IDS.RL_7,
        purchasePrice: 300,
        status: "active",
      },
    ];
  const inventoryItems = await prisma.inventoryItem.createMany({
    data: inventoryItemsData,
  });
  logSuccess(`${inventoryItems.count} inventory items created successfully`);
  return inventoryItems;
}
