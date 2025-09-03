import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../../prisma/prisma.service";
import { BOX_IDS, BOX_TYPE_IDS } from "./seed-constants";

const commandName = "boxes";

@Command({
  name: commandName,
})
export class BoxesSeedCommand extends CommandRunner {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    console.warn(`🔄 Processing ${commandName}...`);
    const createdItemsUniqIdentifiers = [];

    const transaction = options?.transaction || this.prisma;

    const boxesData = [
      // Main boxes
      {
        id: BOX_IDS.MAIN_RL_BOX,
        name: "Главная коробка RL",
        description: "Содержит все RL коробки",
        boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
        parentBoxId: null,
      },
      {
        id: BOX_IDS.MAIN_RS_BOX,
        name: "Главная коробка RS",
        description: "Содержит все RS коробки",
        boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
        parentBoxId: null,
      },
      {
        id: BOX_IDS.MAIN_RM_BOX,
        name: "Главная коробка RM",
        description: "Содержит все RM коробки",
        boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
        parentBoxId: null,
      },
      {
        id: BOX_IDS.MAIN_M1_BOX,
        name: "Главная коробка M1",
        description: "Содержит все M1 коробки",
        boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
        parentBoxId: null,
      },
      {
        id: BOX_IDS.MAIN_OTHER_BOX,
        name: "Главная коробка Остальное",
        description: "Содержит остальные коробки",
        boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
        parentBoxId: null,
      },
      // Sub-boxes
      {
        id: BOX_IDS.BLACK_RL_1,
        name: "Black RL Box 1",
        boxTypeId: BOX_TYPE_IDS.BLACK_RL,
        parentBoxId: BOX_IDS.MAIN_RL_BOX,
      },
      {
        id: BOX_IDS.WHITE_RL_1,
        name: "White RL Box 1",
        boxTypeId: BOX_TYPE_IDS.WHITE_RL,
        parentBoxId: BOX_IDS.MAIN_RL_BOX,
      },
      {
        id: BOX_IDS.BLACK_RS_1,
        name: "Black RS Box 1",
        boxTypeId: BOX_TYPE_IDS.BLACK_RS,
        parentBoxId: BOX_IDS.MAIN_RS_BOX,
      },
      {
        id: BOX_IDS.BLACK_RM_1,
        name: "Black RM Box 1",
        boxTypeId: BOX_TYPE_IDS.BLACK_RM,
        parentBoxId: BOX_IDS.MAIN_RM_BOX,
      },
      {
        id: BOX_IDS.BLACK_M1_1,
        name: "Black M1 Box 1",
        boxTypeId: BOX_TYPE_IDS.BLACK_M1,
        parentBoxId: BOX_IDS.MAIN_M1_BOX,
      },
      {
        id: BOX_IDS.WHITE_M1_1,
        name: "White M1 Box 1",
        boxTypeId: BOX_TYPE_IDS.WHITE_M1,
        parentBoxId: BOX_IDS.MAIN_M1_BOX,
      },
      {
        id: BOX_IDS.DARK_BLUE_BOX_1,
        name: "Dark Blue Box 1",
        boxTypeId: BOX_TYPE_IDS.DARK_BLUE_BOX,
        parentBoxId: BOX_IDS.MAIN_OTHER_BOX,
      },
      {
        id: BOX_IDS.MAST_BLUE_1,
        name: "Mast Blue Box 1",
        boxTypeId: BOX_TYPE_IDS.MAST_BLUE,
        parentBoxId: BOX_IDS.MAIN_OTHER_BOX,
      },
      {
        id: BOX_IDS.GREEN_BOX_TABLE_1,
        name: "Green Box Table 1",
        boxTypeId: BOX_TYPE_IDS.GREEN_BOX_TABLE,
        parentBoxId: BOX_IDS.MAIN_OTHER_BOX,
      },
    ];

    // Get all box IDs that should exist
    const expectedBoxIds = boxesData.map((box) => box.id);

    // Delete boxes that are not in the expected list
    const deleteResult = await transaction.box.deleteMany({
      where: {
        id: {
          notIn: expectedBoxIds,
        },
      },
    });

    console.log(`${deleteResult.count} boxes deleted`);

    // Upsert each box (create or update)
    let createdCount = 0;
    let updatedCount = 0;

    for (const boxData of boxesData) {
      const existingBox = await transaction.box.findUnique({
        where: { id: boxData.id },
      });

      if (existingBox) {
        await transaction.box.update({
          where: { id: boxData.id },
          data: boxData,
        });
        updatedCount++;
      } else {
        await transaction.box.create({
          data: boxData,
        });
        createdCount++;
      }
    }

    console.log(`${createdCount} boxes created, ${updatedCount} boxes updated`);
    console.warn(`✅ Done ${commandName}`);
  }
}
