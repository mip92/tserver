import { PrismaClient, Prisma } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { BRAND_IDS, PrismaTransactionClient } from "./constants";

export async function seedBrands(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Brands");
  const brandsData: Prisma.Enumerable<Prisma.BrandCreateManyInput> = [
    {
      id: BRAND_IDS.YELLOW_DRAGONFLY,
      name: "Yellow Dragonfly",
    },
    {
      id: BRAND_IDS.AB,
      name: "AB",
    },
    {
      id: BRAND_IDS.POSEIDON,
      name: "Poseidon",
    },
    {
      id: BRAND_IDS.STENCIL_STUFF,
      name: "Stencil Stuff",
    },
    {
      id: BRAND_IDS.DYNAMIC,
      name: "Dynamic",
    },
  ];
  const brands = await prisma.brand.createMany({ data: brandsData });
  logSuccess(`${brands.count} brands created successfully`);
  return brands;
}
