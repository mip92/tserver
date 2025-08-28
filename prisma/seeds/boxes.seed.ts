import { PrismaClient, Prisma } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { BOX_IDS, BOX_TYPE_IDS, PrismaTransactionClient } from "./constants";

export async function seedBoxes(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Boxes");

  // Этап 1: Создаем все коробки без родителей
  const boxesData: Prisma.Enumerable<Prisma.BoxCreateManyInput> = [
    // Главные коробки по категориям
    {
      id: BOX_IDS.MAIN_RL_BOX,
      name: "Главная коробка RL",
      description: "Содержит все RL коробки",
      boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
    },
    {
      id: BOX_IDS.MAIN_RS_BOX,
      name: "Главная коробка RS",
      description: "Содержит все RS коробки",
      boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
    },
    {
      id: BOX_IDS.MAIN_RM_BOX,
      name: "Главная коробка RM",
      description: "Содержит все RM коробки",
      boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
    },
    {
      id: BOX_IDS.MAIN_M1_BOX,
      name: "Главная коробка M1",
      description: "Содержит все M1 коробки",
      boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
    },
    {
      id: BOX_IDS.MAIN_OTHER_BOX,
      name: "Главная коробка Остальное",
      description: "Содержит остальные коробки",
      boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
    },

    // RL коробки
    {
      id: BOX_IDS.BLACK_RL_1,
      name: "Black RL Box 1",
      boxTypeId: BOX_TYPE_IDS.BLACK_RL,
    },
    {
      id: BOX_IDS.WHITE_RL_1,
      name: "White RL Box 1",
      boxTypeId: BOX_TYPE_IDS.WHITE_RL,
    },
    {
      id: BOX_IDS.BLACK_RL_2,
      name: "Black RL Box 2",
      boxTypeId: BOX_TYPE_IDS.BLACK_RL,
    },

    // RS коробки
    {
      id: BOX_IDS.BLACK_RS_1,
      name: "Black RS Box 1",
      boxTypeId: BOX_TYPE_IDS.BLACK_RS,
    },
    {
      id: BOX_IDS.BLACK_RS_2,
      name: "Black RS Box 2",
      boxTypeId: BOX_TYPE_IDS.BLACK_RS,
    },

    // RM коробки
    {
      id: BOX_IDS.BLACK_RM_1,
      name: "Black RM Box 1",
      boxTypeId: BOX_TYPE_IDS.BLACK_RM,
    },
    {
      id: BOX_IDS.BLACK_RM_2,
      name: "Black RM Box 2",
      boxTypeId: BOX_TYPE_IDS.BLACK_RM,
    },

    // M1 коробки
    {
      id: BOX_IDS.BLACK_M1_1,
      name: "Black M1 Box 1",
      boxTypeId: BOX_TYPE_IDS.BLACK_M1,
    },
    {
      id: BOX_IDS.WHITE_M1_1,
      name: "White M1 Box 1",
      boxTypeId: BOX_TYPE_IDS.WHITE_M1,
    },

    // Обычные коробки
    {
      id: BOX_IDS.DARK_BLUE_BOX_1,
      name: "Dark Blue Box 1",
      boxTypeId: BOX_TYPE_IDS.DARK_BLUE_BOX,
    },
    {
      id: BOX_IDS.MAST_BLUE_1,
      name: "Mast Blue Box 1",
      boxTypeId: BOX_TYPE_IDS.MAST_BLUE,
    },
    {
      id: BOX_IDS.GREEN_BOX_TABLE_1,
      name: "Green Box Table 1",
      boxTypeId: BOX_TYPE_IDS.GREEN_BOX_TABLE,
    },
    {
      id: BOX_IDS.CUSTOM_BOX_1,
      name: "Custom Box 1",
      boxTypeId: BOX_TYPE_IDS.CUSTOM_BOX,
    },
  ];

  const boxes = await prisma.box.createMany({ data: boxesData });
  logSuccess(`${boxes.count} boxes created successfully`);

  // Этап 2: Устанавливаем иерархию - распределяем коробки по главным категориям
  const boxHierarchy = {
    [BOX_IDS.MAIN_RL_BOX]: [
      BOX_IDS.BLACK_RL_1,
      BOX_IDS.WHITE_RL_1,
      BOX_IDS.BLACK_RL_2,
    ],
    [BOX_IDS.MAIN_RS_BOX]: [BOX_IDS.BLACK_RS_1, BOX_IDS.BLACK_RS_2],
    [BOX_IDS.MAIN_RM_BOX]: [BOX_IDS.BLACK_RM_1, BOX_IDS.BLACK_RM_2],
    [BOX_IDS.MAIN_M1_BOX]: [BOX_IDS.BLACK_M1_1, BOX_IDS.WHITE_M1_1],
    [BOX_IDS.MAIN_OTHER_BOX]: [
      BOX_IDS.DARK_BLUE_BOX_1,
      BOX_IDS.MAST_BLUE_1,
      BOX_IDS.GREEN_BOX_TABLE_1,
      BOX_IDS.CUSTOM_BOX_1,
    ],
  };

  // Устанавливаем parentBoxId для всех дочерних коробок
  for (const [parentBoxId, childBoxIds] of Object.entries(boxHierarchy)) {
    for (const childBoxId of childBoxIds) {
      await prisma.box.update({
        where: { id: childBoxId },
        data: { parentBoxId: parseInt(parentBoxId) },
      });
    }
  }
  logSuccess("Box hierarchy established successfully");

  return boxes;
}
