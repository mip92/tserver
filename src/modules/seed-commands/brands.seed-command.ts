import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../../prisma/prisma.service";
import { BRAND_IDS } from "./seed-constants";

const commandName = "brands";

@Command({
  name: commandName,
})
export class BrandsSeedCommand extends CommandRunner {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    console.warn(`🔄 Processing ${commandName}...`);

    const transaction = options?.transaction || this.prisma;

    const brandsData = [
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

    // Get all brand IDs that should exist
    const expectedBrandIds = brandsData.map((brand) => brand.id);

    // Delete brands that are not in the expected list
    const deleteResult = await transaction.brand.deleteMany({
      where: {
        id: {
          notIn: expectedBrandIds,
        },
      },
    });

    console.log(`${deleteResult.count} brands deleted`);

    // Upsert each brand (create or update)
    let createdCount = 0;
    let updatedCount = 0;

    for (const brandData of brandsData) {
      const existingBrand = await transaction.brand.findUnique({
        where: { id: brandData.id },
      });

      if (existingBrand) {
        await transaction.brand.update({
          where: { id: brandData.id },
          data: brandData,
        });
        updatedCount++;
      } else {
        await transaction.brand.create({
          data: brandData,
        });
        createdCount++;
      }
    }

    console.log(
      `${createdCount} brands created, ${updatedCount} brands updated`
    );
    console.warn(`✅ Done ${commandName}`);
  }
}
