import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import { USER_IDS, ROLE_IDS } from "./seed-constants";

const commandName = "users";

@Command({
  name: commandName,
})
export class UsersSeedCommand extends CommandRunner {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    console.warn(`🔄 Processing ${commandName}...`);

    const transaction = options?.transaction || this.prisma;

    const usersData = [
      {
        id: USER_IDS.ADMIN,
        firstName: "Admin",
        lastName: "User",
        email: "19mip92@gmail.com",
        phone: "+1234567890",
        isActive: true,
        password: await bcrypt.hash("admin123", 10),
        roleId: ROLE_IDS.ADMIN,
      },
    ];

    // Get all user IDs that should exist
    const expectedUserIds = usersData.map((user) => user.id);

    // Delete users that are not in the expected list
    const deleteResult = await transaction.user.deleteMany({
      where: {
        id: {
          notIn: expectedUserIds,
        },
      },
    });

    console.log(`${deleteResult.count} users deleted`);

    // Upsert each user (create or update)
    let createdCount = 0;
    let updatedCount = 0;

    for (const userData of usersData) {
      const existingUser = await transaction.user.findUnique({
        where: { id: userData.id },
      });

      if (existingUser) {
        await transaction.user.update({
          where: { id: userData.id },
          data: userData,
        });
        updatedCount++;
      } else {
        await transaction.user.create({
          data: userData,
        });
        createdCount++;
      }
    }

    console.log(`${createdCount} users created, ${updatedCount} users updated`);
    console.warn(`✅ Done ${commandName}`);
  }
}
