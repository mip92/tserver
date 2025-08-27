import { PrismaClient, Prisma } from "@prisma/client";
import { logSection, logSuccess } from "./utils";
import { ROLE_IDS, ROLE_NAMES, PrismaTransactionClient } from "./constants";

export async function seedRoles(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Roles");
  const rolesData: Prisma.Enumerable<Prisma.RoleCreateManyInput> = [
    {
      id: ROLE_IDS.ADMIN,
      name: ROLE_NAMES.ADMIN,
      description: "Administrator role with full access",
    },
    {
      id: ROLE_IDS.USER,
      name: ROLE_NAMES.USER,
      description: "Regular user role",
    },
  ];
  const roles = await prisma.role.createMany({ data: rolesData });
  logSuccess(`${roles.count} roles created successfully`);
  return roles;
}
