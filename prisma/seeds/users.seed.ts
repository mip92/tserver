import { PrismaClient, Prisma } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { logSection, logSuccess } from "./utils";
import { USER_IDS, ROLE_IDS, PrismaTransactionClient } from "./constants";

export async function seedUsers(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Users");
  const usersData: Prisma.Enumerable<Prisma.UserCreateManyInput> = [
    {
      id: USER_IDS.ADMIN,
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      phone: "+1234567890",
      isActive: true,
      password: "hashedPassword123", // В реальном приложении должен быть хеш
      roleId: ROLE_IDS.ADMIN,
    },
  ];
  const users = await prisma.user.createMany({ data: usersData });
  logSuccess(`${users.count} users created successfully`);
  return users;
}
