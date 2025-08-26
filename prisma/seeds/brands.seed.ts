import { PrismaClient } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { BRAND_IDS } from "./constants";

export async function seedBrands(prisma: PrismaClient) {
  logSection("Seeding Brands");

  const brands = await Promise.all([
    prisma.brand.create({ 
      data: { 
        id: BRAND_IDS.YELLOW_DRAGONFLY,
        name: "Yellow Dragonfly" 
      } 
    }),
    prisma.brand.create({ 
      data: { 
        id: BRAND_IDS.DYNAMIC,
        name: "Dynamic" 
      } 
    }),
    prisma.brand.create({ 
      data: { 
        id: BRAND_IDS.POSEIDON,
        name: "Poseidon" 
      } 
    }),
    prisma.brand.create({ 
      data: { 
        id: BRAND_IDS.AB,
        name: "AB" 
      } 
    }),
    prisma.brand.create({ 
      data: { 
        id: BRAND_IDS.STENCIL_STUFF,
        name: "Stencil Stuff" 
      } 
    }),
    prisma.brand.create({ 
      data: { 
        id: BRAND_IDS.MAST,
        name: "Mast" 
      } 
    }),
  ]);

  logSuccess(`Brands created: ${brands.map((b) => b.name).join(", ")}`);

  return brands;
}
