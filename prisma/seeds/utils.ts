import { PrismaClient } from "@prisma/client";

export function createPrismaClient(): PrismaClient {
  return new PrismaClient();
}

export async function disconnectPrisma(prisma: PrismaClient): Promise<void> {
  await prisma.$disconnect();
}

export function logSection(title: string): void {
  console.log(`\n📋 ${title}`);
  console.log("=".repeat(50));
}

export function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

export function logError(message: string, error?: any): void {
  console.error(`❌ ${message}`);
  if (error) {
    console.error(error);
  }
}
