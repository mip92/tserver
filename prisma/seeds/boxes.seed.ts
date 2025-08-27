import { PrismaClient, Prisma } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { BOX_IDS, BOX_TYPE_IDS, PrismaTransactionClient } from "./constants";

export async function seedBoxes(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Boxes");
  const boxesData: Prisma.Enumerable<Prisma.BoxCreateManyInput> = [
    {
      id: BOX_IDS.BLACK_RL_1,
      boxTypeId: BOX_TYPE_IDS.BLACK_RL,
    },
    {
      id: BOX_IDS.WHITE_RL_1,
      boxTypeId: BOX_TYPE_IDS.WHITE_RL,
    },
    {
      id: BOX_IDS.BLACK_RS_1,
      boxTypeId: BOX_TYPE_IDS.BLACK_RS,
    },
  ];
  const boxes = await prisma.box.createMany({ data: boxesData });
  logSuccess(`${boxes.count} boxes created successfully`);
  return boxes;
}
