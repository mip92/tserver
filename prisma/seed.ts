import { CommandFactory } from "nest-commander";
import { Logger } from "@nestjs/common";
import { SeedCommandsModule } from "../src/modules/seed-commands/seed-commands.module";

// Run the 'all' seed command
CommandFactory.run(SeedCommandsModule, new Logger()).catch((e) => {
  console.error("❌ Error during seeding:", e);
  process.exit(1);
});
