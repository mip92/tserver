import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./roles.seed";
import { seedUsers } from "./users.seed";
import { seedBrands } from "./brands.seed";
import { seedBoxTypes } from "./box-types.seed";
import { seedProducts } from "./products.seed";
import { seedBoxes } from "./boxes.seed";
import { seedInventoryItems } from "./inventory-items.seed";

export async function runSeeds() {
  const prisma = new PrismaClient();

  try {
    console.log("🌱 Starting seeding...");

    // Запускаем все сиды в одной транзакции
    await prisma.$transaction(async (tx) => {
      console.log("🔄 Starting database transaction...");

      await seedRoles(tx);
      await seedUsers(tx);
      await seedBrands(tx);
      await seedBoxTypes(tx);
      await seedProducts(tx);
      await seedBoxes(tx);
      await seedInventoryItems(tx);

      console.log("✅ Transaction completed successfully!");
    });

    console.log("🎉 All seeds completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Если файл запускается напрямую
if (require.main === module) {
  runSeeds().catch((e) => {
    console.error("❌ Fatal error during seeding:", e);
    process.exit(1);
  });
}
