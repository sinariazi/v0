import { PrismaClient } from '@prisma/client'
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

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
    console.error('Error retrieving database credentials:', error);
    throw error;
  }
}

async function createPrismaClient() {
  const credentials = await getDbCredentials();
  return new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://${credentials.username}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.dbname}`,
      },
    },
  });
}

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

