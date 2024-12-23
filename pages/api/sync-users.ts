import { NextApiRequest, NextApiResponse } from "next";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";
import prisma from "@/lib/prisma";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: fromEnv(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("Starting user sync...");
  console.log("AWS Region:", process.env.NEXT_PUBLIC_AWS_REGION);
  console.log("User Pool ID:", process.env.NEXT_PUBLIC_AWS_USER_POOL_ID);

  try {
    // Ensure default organization exists
    const defaultOrg = await prisma.organization.upsert({
      where: { id: "default-org-id" },
      update: {},
      create: {
        id: "default-org-id",
        name: "Default Organization",
      },
    });

    const command = new ListUsersCommand({
      UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID,
    });

    const cognitoUsers = await cognitoClient.send(command);

    console.log("Cognito users:", cognitoUsers);

    let syncedCount = 0;
    for (const cognitoUser of cognitoUsers.Users || []) {
      const email = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "email"
      )?.Value;
      const sub = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "sub"
      )?.Value;

      if (email && sub) {
        await prisma.user.upsert({
          where: { cognitoSub: sub },
          update: {
            email,
            name: cognitoUser.Username || "",
            cognitoUsername: cognitoUser.Username || "",
          },
          create: {
            email,
            name: cognitoUser.Username || "",
            cognitoSub: sub,
            cognitoUsername: cognitoUser.Username || "",
            role: "EMPLOYEE",
            organizationId: defaultOrg.id,
          },
        });
        syncedCount++;
      }
    }

    res
      .status(200)
      .json({
        message: `Users synced successfully. Synced ${syncedCount} users.`,
      });
  } catch (error) {
    console.error("Error syncing users:", error);
    res
      .status(500)
      .json({
        message: `Error syncing users: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
  }
}
