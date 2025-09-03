import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../../prisma/prisma.service";
import { RolesSeedCommand } from "./roles.seed-command";
import { UsersSeedCommand } from "./users.seed-command";
import { BrandsSeedCommand } from "./brands.seed-command";
import { BoxTypesSeedCommand } from "./box-types.seed-command";
import { ProductsSeedCommand } from "./products.seed-command";
import { BoxesSeedCommand } from "./boxes.seed-command";
import { InventoryItemsSeedCommand } from "./inventory-items.seed-command";
import { FilesSeedCommand } from "./files.seed-command";

const commandName = "all";

@Command({
  name: commandName,
})
export class AllSeedCommand extends CommandRunner {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rolesSeedCommand: RolesSeedCommand,
    private readonly usersSeedCommand: UsersSeedCommand,
    private readonly brandsSeedCommand: BrandsSeedCommand,
    private readonly boxTypesSeedCommand: BoxTypesSeedCommand,
    private readonly productsSeedCommand: ProductsSeedCommand,
    private readonly boxesSeedCommand: BoxesSeedCommand,
    private readonly inventoryItemsSeedCommand: InventoryItemsSeedCommand,
    private readonly filesSeedCommand: FilesSeedCommand
  ) {
    super();
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>
  ): Promise<void> {
    console.warn(
      `🔄 Processing ${commandName} - running all seed commands in single transaction...`
    );

    try {
      await this.prisma.$transaction(
        async (transaction) => {
          const transactionOptions = { ...options, transaction };

          await this.rolesSeedCommand.run([], transactionOptions);
          await this.usersSeedCommand.run([], transactionOptions);
          await this.brandsSeedCommand.run([], transactionOptions);
          await this.boxTypesSeedCommand.run([], transactionOptions);
          await this.productsSeedCommand.run([], transactionOptions);
          await this.boxesSeedCommand.run([], transactionOptions);
          await this.inventoryItemsSeedCommand.run([], transactionOptions);
          await this.filesSeedCommand.run([], transactionOptions);
        },
        {
          timeout: 60000, // 60 seconds timeout for file uploads
        }
      );

      console.warn(
        `✅ Done ${commandName} - all seed commands completed successfully in single transaction!`
      );
    } catch (error) {
      console.error(`❌ Error in ${commandName}:`, error);
      throw error;
    }
  }
}
