import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../../prisma/prisma.service";
import { ROLE_IDS, ROLE_NAMES } from "./seed-constants";

const commandName = "roles";

@Command({
  name: commandName,
})
export class RolesSeedCommand extends CommandRunner {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    console.warn(`🔄 Processing ${commandName}...`);

    const transaction = options?.transaction || this.prisma;

    const rolesData = [
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

    // Get all role IDs that should exist
    const expectedRoleIds = rolesData.map((role) => role.id);

    // Delete roles that are not in the expected list
    const deleteResult = await transaction.role.deleteMany({
      where: {
        id: {
          notIn: expectedRoleIds,
        },
      },
    });

    console.log(`${deleteResult.count} roles deleted`);

    // Upsert each role (create or update)
    let createdCount = 0;
    let updatedCount = 0;

    for (const roleData of rolesData) {
      const existingRole = await transaction.role.findUnique({
        where: { id: roleData.id },
      });

      if (existingRole) {
        await transaction.role.update({
          where: { id: roleData.id },
          data: roleData,
        });
        updatedCount++;
      } else {
        await transaction.role.create({
          data: roleData,
        });
        createdCount++;
      }
    }

    console.log(`${createdCount} roles created, ${updatedCount} roles updated`);
    console.warn(`✅ Done ${commandName}`);
  }
}
