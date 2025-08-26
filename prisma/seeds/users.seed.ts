import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { logSection, logSuccess } from "./utils";
import { USER_IDS, ROLE_IDS, PrismaTransactionClient } from "./constants";

export async function seedUsers(
  prisma: PrismaClient | PrismaTransactionClient
) {
  logSection("Seeding Users");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const usersData = [
    {
      id: USER_IDS.ADMIN,
      email: "19mip92@gmail.com",
      firstName: "Admin",
      lastName: "User",
      password: hashedPassword,
      isActive: true,
      roleId: ROLE_IDS.ADMIN,
    },
  ];

  const users = await prisma.user.createMany({
    data: usersData,
  });

  logSuccess(`${users.count} users created successfully`);

  return users;
}
