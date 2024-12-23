const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Attempt to query the database
    const result = await prisma.$queryRaw`SELECT 1 + 1 AS result`;
    console.log("Database connection successful!");
    console.log("Query result:", result);
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
