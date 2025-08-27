import { PrismaClient, Prisma } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { BOX_TYPE_IDS, PrismaTransactionClient } from "./constants";

export async function seedBoxTypes(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Box Types");
  const boxTypesData: Prisma.Enumerable<Prisma.BoxTypeCreateManyInput> = [
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
  const boxTypes = await prisma.boxType.createMany({ data: boxTypesData });
  logSuccess(`${boxTypes.count} box types created successfully`);
  return boxTypes;
}
