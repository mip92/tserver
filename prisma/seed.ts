import { runSeeds } from "./seeds";

runSeeds()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  });
