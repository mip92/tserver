import { PrismaClient } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { BOX_IDS, BOX_TYPE_IDS, PrismaTransactionClient } from "./constants";

export async function seedBoxes(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Boxes");

  // Создаем коробки для каждого типа
  const boxesData = [
    // RL коробки
    {
      id: BOX_IDS.BLACK_RL_1,
      boxTypeId: BOX_TYPE_IDS.BLACK_RL,
    },
    {
      id: BOX_IDS.WHITE_RL_1,
      boxTypeId: BOX_TYPE_IDS.WHITE_RL,
    },
    {
      id: BOX_IDS.BLACK_RL_2,
      boxTypeId: BOX_TYPE_IDS.BLACK_RL,
    },

    // RS коробки
    {
      id: BOX_IDS.BLACK_RS_1,
      boxTypeId: BOX_TYPE_IDS.BLACK_RS,
    },
    {
      id: BOX_IDS.BLACK_RS_2,
      boxTypeId: BOX_TYPE_IDS.BLACK_RS,
    },

    // RM коробки
    {
      id: BOX_IDS.BLACK_RM_1,
      boxTypeId: BOX_TYPE_IDS.BLACK_RM,
    },
    {
      id: BOX_IDS.BLACK_RM_2,
      boxTypeId: BOX_TYPE_IDS.BLACK_RM,
    },

    // M1 коробки
    {
      id: BOX_IDS.BLACK_M1_1,
      boxTypeId: BOX_TYPE_IDS.BLACK_M1,
    },
    {
      id: BOX_IDS.WHITE_M1_1,
      boxTypeId: BOX_TYPE_IDS.WHITE_M1,
    },

    // Обычные коробки
    {
      id: BOX_IDS.DARK_BLUE_BOX_1,
      boxTypeId: BOX_TYPE_IDS.DARK_BLUE_BOX,
    },
    {
      id: BOX_IDS.MAST_BLUE_1,
      boxTypeId: BOX_TYPE_IDS.MAST_BLUE,
    },
    {
      id: BOX_IDS.GREEN_BOX_TABLE_1,
      boxTypeId: BOX_TYPE_IDS.GREEN_BOX_TABLE,
    },
    {
      id: BOX_IDS.CUSTOM_BOX_1,
      boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
    },
  ];

  const boxes = await prisma.box.createMany({
    data: boxesData,
  });

  logSuccess(`${boxes.count} boxes created successfully`);

  return boxes;
}
