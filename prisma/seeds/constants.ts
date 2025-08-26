import { PrismaClient } from "@prisma/client";

// Тип для транзакционного клиента Prisma
export type PrismaTransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

// Константы для ID ролей
export const ROLE_IDS = {
  ADMIN: 1,
  USER: 2,
} as const;

// Константы для ID пользователей
export const USER_IDS = {
  ADMIN: 1,
} as const;

// Константы для ID брендов
export const BRAND_IDS = {
  YELLOW_DRAGONFLY: 1,
  DYNAMIC: 2,
  POSEIDON: 3,
  AB: 4,
  STENCIL_STUFF: 5,
  MAST: 6,
} as const;

// Константы для ID типов коробок
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

// Константы для ID продуктов
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

// Константы для ID коробок
export const BOX_IDS = {
  // RL коробки
  BLACK_RL_1: 1,
  WHITE_RL_1: 2,
  BLACK_RL_2: 3,

  // RS коробки
  BLACK_RS_1: 4,
  BLACK_RS_2: 5,

  // RM коробки
  BLACK_RM_1: 6,
  BLACK_RM_2: 7,

  // M1 коробки
  BLACK_M1_1: 8,
  WHITE_M1_1: 9,

  // Обычные коробки
  DARK_BLUE_BOX_1: 10,
  MAST_BLUE_1: 11,
  GREEN_BOX_TABLE_1: 12,
  CUSTOM_BOX_1: 13,
} as const;

// Константы для ID box products
export const BOX_PRODUCT_IDS = {
  // Коробка 1 (black_RL) - картриджи RL
  RL_3_CARTRIDGES_1: 1,
  RL_5_CARTRIDGES_1: 2,
  RL_7_CARTRIDGES_1: 3,

  // Коробка 2 (white_RL) - картриджи RL
  RL_3_WHITE_CARTRIDGES: 4,
  RL_5_WHITE_CARTRIDGES: 5,

  // Коробка 3 (black_RL) - дополнительные RL
  RL_9_CARTRIDGES: 6,
  RL_11_CARTRIDGES: 7,

  // Коробка 4 (black_RS) - картриджи RS
  RS_3_CARTRIDGES: 8,
  RS_5_CARTRIDGES: 9,

  // Коробка 5 (black_RS) - дополнительные RS
  RS_7_CARTRIDGES: 10,
  RS_9_CARTRIDGES: 11,

  // Коробка 6 (black_RM) - картриджи RM
  RM_5_CARTRIDGES: 12,
  RM_7_CARTRIDGES: 13,

  // Коробка 7 (black_RM) - дополнительные RM
  RM_9_CARTRIDGES: 14,
  RM_11_CARTRIDGES: 15,

  // Коробка 8 (black_M1) - картриджи M1
  M1_5_CARTRIDGES: 16,
  M1_7_CARTRIDGES: 17,

  // Коробка 9 (white_M1) - картриджи M1
  M1_9_WHITE_CARTRIDGES: 18,

  // Коробка 10 (dark_blue_box) - краски и гели
  BLACK_PAINT_1: 19,
  TRANSFER_GEL_1: 20,

  // Коробка 11 (mast_blue) - специальные продукты
  BOX_PRODUCT_1: 21,

  // Коробка 12 (green_box_table) - различные продукты
  DYNAMIC_RL_3_1: 22,
  DYNAMIC_RL_5_1: 23,
  DYNAMIC_RL_7_1: 24,
} as const;
