import { PrismaClient } from "@prisma/client";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

declare global {
  var prisma: PrismaClient | undefined;
}

const secret_name = "rds!db-0069e07a-3e23-450a-9162-53129a724b40";

async function getDbCredentials() {
  const client = new SecretsManagerClient({
    region: "eu-central-1",
  });

  try {
    const response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );

    if (response.SecretString) {
      return JSON.parse(response.SecretString);
    } else {
      throw new Error("Secret string is empty");
    }
  } catch (error) {
    console.error("Error retrieving database credentials:", error);
    throw error;
  }
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Initialize database connection
async function initializePrisma() {
  if (process.env.NODE_ENV === "production") {
    try {
      const credentials = await getDbCredentials();
      const url = `postgresql://${credentials.username}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.dbname}`;

      await prisma.$connect();
      console.log("Successfully connected to the database");
    } catch (error) {
      console.error("Failed to initialize database connection:", error);
      throw error;
    }
  }
}

// Call initialization
initializePrisma().catch(console.error);

export default prisma;
