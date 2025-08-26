import { PrismaClient } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { ROLE_IDS, PrismaTransactionClient } from "./constants";

export async function seedRoles(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Roles");

  const adminRole = await prisma.role.create({
    data: {
      id: ROLE_IDS.ADMIN,
      name: "admin",
      description: "Administrator role with full access",
    },
  });

  const userRole = await prisma.role.create({
    data: {
      id: ROLE_IDS.USER,
      name: "user",
      description: "Regular user role",
    },
  });

  logSuccess(
    `Roles created: admin (${adminRole.name}), user (${userRole.name})`
  );

  return { adminRole, userRole };
}
