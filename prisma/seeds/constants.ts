import { PrismaClient } from "@prisma/client";

// Type for the transactional Prisma client
export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

// Constants for ID roles
export const ROLE_IDS = {
  ADMIN: 1,
  USER: 2,
} as const;

// Constants for role names (enum values)
export const ROLE_NAMES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

// Constants for ID users
export const USER_IDS = {
  ADMIN: 1,
} as const;

// Constants for ID brands
export const BRAND_IDS = {
  YELLOW_DRAGONFLY: 1,
  DYNAMIC: 2,
  POSEIDON: 3,
  AB: 4,
  STENCIL_STUFF: 5,
  MAST: 6,
} as const;

// Constants for ID box types
export const BOX_TYPE_IDS = {
  BLACK_RL: 1,
  WHITE_RL: 2,
  BLACK_RS: 3,
  BLACK_RM: 4,
  BLACK_M1: 5,
  WHITE_M1: 6,
  DARK_BLUE_BOX: 7,
  MAST_BLUE: 8,
  GREEN_BOX_TABLE: 9,
  CUSTOM_BOX: 10,
} as const;

// Constants for ID products
export const PRODUCT_IDS = {
  // Yellow Dragonfly (RL)
  RL_1: 1,
  RL_3: 2,
  RL_5: 3,
  RL_7: 4,
  RL_9: 5,
  RL_11: 6,
  RL_14: 7,

  // Yellow Dragonfly (RS)
  RS_3: 8,
  RS_5: 9,
  RS_7: 10,
  RS_9: 11,
  RS_11: 12,
  RS_14: 13,

  // AB (RS)
  RS_9_AB: 14,

  // Yellow Dragonfly (RM)
  RM_5: 15,
  RM_7: 16,
  RM_9: 17,
  RM_11: 18,
  RM_13: 19,

  // AB (RM)
  RM_15: 20,
  RM_17: 21,
  RM_35: 22,
  RM_39: 23,
  RM_45: 24,

  // Yellow Dragonfly (M1)
  M1_5: 25,
  M1_7: 26,
  M1_9: 27,

  // Poseidon (box)
  BOX: 28,

  // Dynamic (RL)
  DYNAMIC_RL_3: 29,
  DYNAMIC_RL_5: 30,
  DYNAMIC_RL_7: 31,
  DYNAMIC_RL_9: 32,
  DYNAMIC_RL_11: 33,

  // Poseidon (Paint)
  BLACK_PAINT: 34,

  // Stencil Stuff (transfer gel)
  TRANSFER_GEL: 35,

  // AB (RS)
  RS_5_AB: 36,
} as const;

// Constants for ID boxes
export const BOX_IDS = {
  // Главные коробки по категориям
  MAIN_RL_BOX: 1, // Главная коробка для RL игл
  MAIN_RS_BOX: 2, // Главная коробка для RS игл
  MAIN_RM_BOX: 3, // Главная коробка для RM игл
  MAIN_M1_BOX: 4, // Главная коробка для M1 игл
  MAIN_OTHER_BOX: 5, // Главная коробка для остального

  // RL коробки
  BLACK_RL_1: 6,
  WHITE_RL_1: 7,
  BLACK_RL_2: 8,

  // RS коробки
  BLACK_RS_1: 9,
  BLACK_RS_2: 10,

  // RM коробки
  BLACK_RM_1: 11,
  BLACK_RM_2: 12,

  // M1 коробки
  BLACK_M1_1: 13,
  WHITE_M1_1: 14,

  // Обычные коробки
  DARK_BLUE_BOX_1: 15,
  MAST_BLUE_1: 16,
  GREEN_BOX_TABLE_1: 17,
  CUSTOM_BOX_1: 18,
} as const;

// Constants for ID inventory items
export const INVENTORY_ITEM_IDS = {
  RL_3_CARTRIDGES_1: 1,
  RL_5_CARTRIDGES_1: 2,
  RL_7_CARTRIDGES_1: 3,
  RL_9_CARTRIDGES_1: 4,
  RL_11_CARTRIDGES_1: 5,
  RL_14_CARTRIDGES_1: 6,
  RS_3_CARTRIDGES_1: 7,
  RS_5_CARTRIDGES_1: 8,
  RS_7_CARTRIDGES_1: 9,
  RS_9_CARTRIDGES_1: 10,
  RS_11_CARTRIDGES_1: 11,
  RS_14_CARTRIDGES_1: 12,
  RM_5_CARTRIDGES_1: 13,
  RM_7_CARTRIDGES_1: 14,
  RM_9_CARTRIDGES_1: 15,
  RM_11_CARTRIDGES_1: 16,
  RM_13_CARTRIDGES_1: 17,
  RM_15_CARTRIDGES_1: 18,
  RM_17_CARTRIDGES_1: 19,
  RM_35_CARTRIDGES_1: 20,
  M1_5_CARTRIDGES_1: 21,
  M1_7_CARTRIDGES_1: 22,
  M1_9_CARTRIDGES_1: 23,
  BOX_1: 24,
} as const;
