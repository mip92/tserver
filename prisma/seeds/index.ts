import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./roles.seed";
import { seedUsers } from "./users.seed";
import { seedBrands } from "./brands.seed";
import { seedBoxTypes } from "./box-types.seed";
import { seedProducts } from "./products.seed";
import { seedBoxes } from "./boxes.seed";
import { seedBoxProducts } from "./box-products.seed";
import { ROLE_IDS } from "./constants";

export async function runSeeds() {
  const prisma = new PrismaClient();

  try {
    console.log("🌱 Starting seeding...");

    await seedRoles(prisma);
    await seedUsers(prisma);
    await seedBrands(prisma);
    await seedBoxTypes(prisma);
    await seedProducts(prisma);
    await seedBoxes(prisma);
    await seedBoxProducts(prisma);

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
