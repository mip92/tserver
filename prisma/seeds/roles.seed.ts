import { PrismaClient } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { ROLE_IDS, PrismaTransactionClient } from "./constants";

export async function seedRoles(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Roles");

  const rolesData = [
    {
      id: ROLE_IDS.ADMIN,
      name: "admin",
      description: "Administrator role with full access",
    },
    {
      id: ROLE_IDS.USER,
      name: "user",
      description: "Regular user role",
    },
  ];

  const roles = await prisma.role.createMany({
    data: rolesData,
  });

  logSuccess(`${roles.count} roles created successfully`);

  return roles;
}
