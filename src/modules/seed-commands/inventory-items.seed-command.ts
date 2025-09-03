import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../../prisma/prisma.service";
import { INVENTORY_ITEM_IDS, BOX_IDS, PRODUCT_IDS } from "./seed-constants";

const commandName = "inventory-items";

@Command({
  name: commandName,
})
export class InventoryItemsSeedCommand extends CommandRunner {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    console.warn(`🔄 Processing ${commandName}...`);

    const transaction = options?.transaction || this.prisma;

    const inventoryItemsData = [
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

    // Get all inventory item IDs that should exist
    const expectedInventoryItemIds = inventoryItemsData.map((item) => item.id);

    // Delete inventory items that are not in the expected list
    const deleteResult = await transaction.inventoryItem.deleteMany({
      where: {
        id: {
          notIn: expectedInventoryItemIds,
        },
      },
    });

    console.log(`${deleteResult.count} inventory items deleted`);

    // Upsert each inventory item (create or update)
    let createdCount = 0;
    let updatedCount = 0;

    for (const inventoryItemData of inventoryItemsData) {
      const existingInventoryItem = await transaction.inventoryItem.findUnique({
        where: { id: inventoryItemData.id },
      });

      if (existingInventoryItem) {
        await transaction.inventoryItem.update({
          where: { id: inventoryItemData.id },
          data: inventoryItemData,
        });
        updatedCount++;
      } else {
        await transaction.inventoryItem.create({
          data: inventoryItemData,
        });
        createdCount++;
      }
    }

    console.log(
      `${createdCount} inventory items created, ${updatedCount} inventory items updated`
    );
    console.warn(`✅ Done ${commandName}`);
  }
}
