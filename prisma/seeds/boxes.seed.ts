import { PrismaClient } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { BOX_IDS, BOX_TYPE_IDS } from "./constants";

export async function seedBoxes(prisma: PrismaClient) {
  logSection("Seeding Boxes");

  // Создаем коробки для каждого типа
  const boxes = await Promise.all([
    // RL коробки
    prisma.box.create({
      data: {
        id: BOX_IDS.BLACK_RL_1,
        boxTypeId: BOX_TYPE_IDS.BLACK_RL,
      },
    }),
    prisma.box.create({
      data: {
        id: BOX_IDS.WHITE_RL_1,
        boxTypeId: BOX_TYPE_IDS.WHITE_RL,
      },
    }),
    prisma.box.create({
      data: {
        id: BOX_IDS.BLACK_RL_2,
        boxTypeId: BOX_TYPE_IDS.BLACK_RL,
      },
    }),

    // RS коробки
    prisma.box.create({
      data: {
        id: BOX_IDS.BLACK_RS_1,
        boxTypeId: BOX_TYPE_IDS.BLACK_RS,
      },
    }),
    prisma.box.create({
      data: {
        id: BOX_IDS.BLACK_RS_2,
        boxTypeId: BOX_TYPE_IDS.BLACK_RS,
      },
    }),

    // RM коробки
    prisma.box.create({
      data: {
        id: BOX_IDS.BLACK_RM_1,
        boxTypeId: BOX_TYPE_IDS.BLACK_RM,
      },
    }),
    prisma.box.create({
      data: {
        id: BOX_IDS.BLACK_RM_2,
        boxTypeId: BOX_TYPE_IDS.BLACK_RM,
      },
    }),

    // M1 коробки
    prisma.box.create({
      data: {
        id: BOX_IDS.BLACK_M1_1,
        boxTypeId: BOX_TYPE_IDS.BLACK_M1,
      },
    }),
    prisma.box.create({
      data: {
        id: BOX_IDS.WHITE_M1_1,
        boxTypeId: BOX_TYPE_IDS.WHITE_M1,
      },
    }),

    // Обычные коробки
    prisma.box.create({
      data: {
        id: BOX_IDS.DARK_BLUE_BOX_1,
        boxTypeId: BOX_TYPE_IDS.DARK_BLUE_BOX,
      },
    }),
    prisma.box.create({
      data: {
        id: BOX_IDS.MAST_BLUE_1,
        boxTypeId: BOX_TYPE_IDS.MAST_BLUE,
      },
    }),
    prisma.box.create({
      data: {
        id: BOX_IDS.GREEN_BOX_TABLE_1,
        boxTypeId: BOX_TYPE_IDS.GREEN_BOX_TABLE,
      },
    }),
    prisma.box.create({
      data: {
        id: BOX_IDS.CUSTOM_BOX_1,
        boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
      },
    }),
  ]);

  logSuccess(`${boxes.length} boxes created successfully`);

  return boxes;
}
