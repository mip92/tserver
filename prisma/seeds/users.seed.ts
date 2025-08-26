import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { logSection, logSuccess } from "./utils";
import { USER_IDS, ROLE_IDS } from "./constants";

export async function seedUsers(prisma: PrismaClient) {
  logSection("Seeding Users");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.create({
    data: {
      id: USER_IDS.ADMIN,
      email: "19mip92@gmail.com",
      firstName: "Admin",
      lastName: "User",
      password: hashedPassword,
      isActive: true,
      roleId: ROLE_IDS.ADMIN,
    },
  });

  logSuccess(
    `Admin user created: ${adminUser.firstName} ${adminUser.lastName} (${adminUser.email})`
  );

  return adminUser;
}
