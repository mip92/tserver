import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../../prisma/prisma.service";
import { BOX_TYPE_IDS } from "./seed-constants";

const commandName = "box-types";

@Command({
  name: commandName,
})
export class BoxTypesSeedCommand extends CommandRunner {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    console.warn(`🔄 Processing ${commandName}...`);

    const transaction = options?.transaction || this.prisma;

    const boxTypesData = [
      {
        id: BOX_TYPE_IDS.BLACK_RL,
        name: "black_RL",
        type: "RL",
        quantity: 20,
      },
      {
        id: BOX_TYPE_IDS.WHITE_RL,
        name: "white_RL",
        type: "RL",
        quantity: 10,
      },
      {
        id: BOX_TYPE_IDS.BLACK_RS,
        name: "black_RS",
        type: "RS",
        quantity: 20,
      },
      {
        id: BOX_TYPE_IDS.BLACK_RM,
        name: "black_RM",
        type: "RM",
        quantity: 20,
      },
      {
        id: BOX_TYPE_IDS.BLACK_M1,
        name: "black_M1",
        type: "M1",
        quantity: 20,
      },
      {
        id: BOX_TYPE_IDS.WHITE_M1,
        name: "white_M1",
        type: "M1",
        quantity: 10,
      },
      {
        id: BOX_TYPE_IDS.DARK_BLUE_BOX,
        name: "dark_blue_box",
        type: "box",
        quantity: 50,
      },
      {
        id: BOX_TYPE_IDS.MAST_BLUE,
        name: "mast_blue",
        type: "blue",
        quantity: 20,
      },
      {
        id: BOX_TYPE_IDS.GREEN_BOX_TABLE,
        name: "green_box_table",
        type: "box",
        quantity: 999,
      },
      {
        id: BOX_TYPE_IDS.CUSTOM_BOX,
        name: "custom_box",
        type: "box",
        quantity: 10,
      },
    ];

    // Get all box type IDs that should exist
    const expectedBoxTypeIds = boxTypesData.map((boxType) => boxType.id);

    // Delete box types that are not in the expected list
    const deleteResult = await transaction.boxType.deleteMany({
      where: {
        id: {
          notIn: expectedBoxTypeIds,
        },
      },
    });

    console.log(`${deleteResult.count} box types deleted`);

    // Upsert each box type (create or update)
    let createdCount = 0;
    let updatedCount = 0;

    for (const boxTypeData of boxTypesData) {
      const existingBoxType = await transaction.boxType.findUnique({
        where: { id: boxTypeData.id },
      });

      if (existingBoxType) {
        await transaction.boxType.update({
          where: { id: boxTypeData.id },
          data: boxTypeData,
        });
        updatedCount++;
      } else {
        await transaction.boxType.create({
          data: boxTypeData,
        });
        createdCount++;
      }
    }

    console.log(
      `${createdCount} box types created, ${updatedCount} box types updated`
    );
    console.warn(`✅ Done ${commandName}`);
  }
}
